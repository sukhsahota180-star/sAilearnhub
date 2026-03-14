/**
 * Client-Side Server Configuration Manager
 * Handles auto-discovery, connection management, and fallback logic
 * Works across network devices
 */

class ServerConfig {
    constructor() {
        this.configFile = 'server-config.json';
        this.config = null;
        this.currentServerIndex = 0;
        this.healthCheckInterval = 30000; // 30 seconds
        this.healthCheckTimer = null;
        this.retryAttempts = 3;
        this.retryDelay = 2000; // 2 seconds initial, exponential backoff
    }

    /**
     * Initialize configuration on page load
     */
    async init() {
        try {
            // Try to load saved configuration first
            const saved = await this.loadSavedConfig();
            if (saved) {
                console.log('✓ Loaded saved server configuration');
                return true;
            }

            // If no saved config, attempt auto-discovery
            console.log('Starting auto-discovery...');
            const discovered = await this.autoDiscoverServer();
            if (discovered) {
                console.log('✓ Server auto-discovered');
                return true;
            }

            console.warn('⚠ Auto-discovery failed, using default localhost');
            this.config = {
                serverUrl: 'http://localhost:3000',
                port: 3000,
                fallbacks: [
                    { url: 'http://127.0.0.1:3000' },
                    { url: 'http://192.168.1.100:3000' }
                ],
                type: 'default'
            };
            return false;

        } catch (error) {
            console.error('Configuration error:', error);
            this.config = { serverUrl: 'http://localhost:3000', port: 3000 };
            return false;
        }
    }

    /**
     * Load previously saved configuration
     */
    async loadSavedConfig() {
        try {
            const response = await fetch(this.configFile);
            if (response.ok) {
                this.config = await response.json();
                console.log('Config loaded:', this.config.serverUrl);
                return true;
            }
            return false;
        } catch (error) {
            console.log('No saved config found');
            return false;
        }
    }

    /**
     * Auto-discover server on network
     */
    async autoDiscoverServer() {
        const urls = [
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ];

        // Try to get IP from server-config.json first
        try {
            const response = await fetch('server-config.json');
            if (response.ok) {
                const serverConfig = await response.json();
                if (serverConfig.networkAddresses) {
                    serverConfig.networkAddresses.forEach(addr => {
                        if (!urls.includes(addr.url)) {
                            urls.push(addr.url);
                        }
                    });
                }
                if (serverConfig.fallbacks) {
                    serverConfig.fallbacks.forEach(fb => {
                        if (!urls.includes(fb.url)) {
                            urls.push(fb.url);
                        }
                    });
                }
            }
        } catch (error) {
            // Continue with default URLs
        }

        // Test each URL
        for (const url of urls) {
            if (await this.checkServerHealth(url)) {
                this.config = {
                    serverUrl: url,
                    port: 3000,
                    discoveredAt: new Date().toISOString(),
                    type: 'discovered',
                    fallbacks: urls.filter(u => u !== url).map(u => ({ url: u }))
                };
                return true;
            }
        }

        return false;
    }

    /**
     * Check if server is healthy at given URL
     */
    async checkServerHealth(url) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${url}/api/health`, {
                method: 'GET',
                signal: controller.signal,
                credentials: 'include'
            });

            clearTimeout(timeout);
            return response.ok;

        } catch (error) {
            return false;
        }
    }

    /**
     * Verify current server connection
     */
    async verifyConnection() {
        if (!this.config) {
            await this.init();
        }

        try {
            const response = await fetch(`${this.config.serverUrl}/api/health`, {
                credentials: 'include',
                signal: AbortSignal.timeout(5000)
            });
            return response.ok;
        } catch (error) {
            console.warn('Server verification failed:', error);
            return false;
        }
    }

    /**
     * Get server URL with automatic fallback
     */
    getServerUrl() {
        if (!this.config) {
            return 'http://localhost:3000';
        }
        return this.config.serverUrl;
    }

    /**
     * Make request with automatic retry and fallback
     */
    async makeRequest(endpoint, options = {}) {
        if (!this.config) {
            await this.init();
        }

        const urls = [
            this.config.serverUrl,
            ...(this.config.fallbacks || []).map(f => f.url)
        ];

        let lastError = null;

        for (let urlIndex = 0; urlIndex < urls.length; urlIndex++) {
            const baseUrl = urls[urlIndex];

            for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
                try {
                    const url = `${baseUrl}${endpoint}`;
                    const delay = Math.pow(2, attempt - 1) * this.retryDelay; // Exponential backoff

                    if (attempt > 1) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }

                    const controller = new AbortController();
                    const timeout = setTimeout(() => controller.abort(), 10000);

                    const response = await fetch(url, {
                        ...options,
                        signal: controller.signal,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            ...options.headers
                        }
                    });

                    clearTimeout(timeout);

                    if (response.ok || (response.status >= 400 && response.status < 500)) {
                        // Success or client error (don't retry)
                        if (response.ok && baseUrl !== this.config.serverUrl) {
                            // Update primary URL to the working one
                            this.config.serverUrl = baseUrl;
                            this.saveConfig();
                        }
                        return response;
                    }

                    lastError = `HTTP ${response.status}`;

                } catch (error) {
                    lastError = error.message;
                    if (attempt === this.retryAttempts && urlIndex === urls.length - 1) {
                        console.error(`All connection attempts failed: ${lastError}`);
                        throw new Error(`Cannot reach server. Last error: ${lastError}`);
                    }
                }
            }
        }

        throw new Error(`Cannot reach any server. Last error: ${lastError}`);
    }

    /**
     * Save configuration to local storage
     */
    saveConfig() {
        try {
            localStorage.setItem('serverConfig', JSON.stringify(this.config));
        } catch (error) {
            console.warn('Could not save config to localStorage:', error);
        }
    }

    /**
     * Start health monitoring
     */
    startHealthMonitoring() {
        if (this.healthCheckTimer) {
            clearInterval(this.healthCheckTimer);
        }

        this.healthCheckTimer = setInterval(async () => {
            const isHealthy = await this.verifyConnection();
            if (!isHealthy) {
                console.warn('⚠ Server connection lost, attempting auto-discovery...');
                await this.autoDiscoverServer();
            }
        }, this.healthCheckInterval);
    }

    /**
     * Stop health monitoring
     */
    stopHealthMonitoring() {
        if (this.healthCheckTimer) {
            clearInterval(this.healthCheckTimer);
            this.healthCheckTimer = null;
        }
    }

    /**
     * Get current status
     */
    async getStatus() {
        const isConnected = await this.verifyConnection();
        return {
            connected: isConnected,
            serverUrl: this.getServerUrl(),
            config: this.config,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Force reconnection to alternate server
     */
    async reconnect() {
        console.log('Attempting to reconnect...');
        const discovered = await this.autoDiscoverServer();
        return discovered;
    }

    /**
     * Set custom server URL (for manual configuration)
     */
    setServerUrl(url) {
        if (!this.config) {
            this.config = {};
        }
        this.config.serverUrl = url;
        this.config.type = 'manual';
        this.saveConfig();
        console.log('Server URL manually set to:', url);
    }
}

// Initialize on page load
const serverConfig = new ServerConfig();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        serverConfig.init().then(() => {
            serverConfig.startHealthMonitoring();
        });
    });
} else {
    serverConfig.init().then(() => {
        serverConfig.startHealthMonitoring();
    });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    serverConfig.stopHealthMonitoring();
});

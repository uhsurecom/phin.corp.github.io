document.addEventListener('DOMContentLoaded', () => {
    // Splash Screen Timer
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const header = document.getElementById('portal-header');
        const content = document.getElementById('main-content');
        
        if (splash) splash.style.display = 'none';
        if (header && !header.classList.contains('fade-in')) header.classList.add('fade-in');
        if (content) content.classList.remove('fade-in-up');
    }, 2000);

    // Alpine.js App Initialization
    window.Alpine = Alpine;
    
    if (typeof Alpine !== 'undefined') {
        document.addEventListener('alpine:init', () => {
            Alpine.data('redeemApp', () => ({
                userInput: '',
                error: null,
                loading: false,
                showModal: false,
                currentReward: {},

                init() {
                    // Focus input on load
                    setTimeout(() => {
                        const input = document.getElementById('code-input');
                        if (input) input.focus();
                    }, 500);
                    
                    // Keyboard shortcut to focus
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' && !this.loading) {
                            this.handleRedeem();
                        }
                    });
                },

                async handleRedeem() {
                    const trimmedCode = this.userInput.trim().toUpperCase();
                    
                    // Basic validation
                    if (!trimmedCode || trimmedCode.length < 2) {
                        this.error = 'Please enter a valid code (at least 2 characters).';
                        return;
                    }

                    this.loading = true;
                    this.error = null;

                    try {
                        const codesData = await fetch('codes.json')
                            .then(response => response.json());

                        // Check if code exists in list
                        const validCode = codesData.validCodes.find(
                            c => c.code.toUpperCase() === trimmedCode
                        );

                        if (validCode) {
                            this.currentReward = validCode;
                            this.showModal = true;
                            
                            // Optional: Clear input after success
                            setTimeout(() => {
                                this.userInput = '';
                                this.error = null;
                            }, 500);
                        } else {
                            this.error = `Invalid code "${trimmedCode}". Try again! 😅`;
                        }

                    } catch (err) {
                        console.error('Error fetching codes:', err);
                        this.error = 'Oops! Something went wrong. Check your connection.';
                    } finally {
                        this.loading = false;
                    }
                },

                closeModal() {
                    this.showModal = false;
                    // Optional: Reset form after modal closes
                    setTimeout(() => {
                        this.userInput = '';
                        this.error = null;
                    }, 300);
                }
            }));
        });
    } else {
        console.warn('Alpine.js not loaded');
        
        // Fallback: Vanilla JS version if Alpine fails
        const appData = document.querySelector('[x-data]');
        if (appData) {
            const data = {
                userInput: '',
                error: null,
                loading: false,
                showModal: false,
                currentReward: {},

                handleRedeem() {
                    const trimmedCode = this.userInput.trim().toUpperCase();
                    
                    if (!trimmedCode || trimmedCode.length < 2) {
                        this.error = 'Please enter a valid code (at least 2 characters).';
                        return;
                    }

                    this.loading = true;
                    this.error = null;

                    fetch('codes.json')
                        .then(response => response.json())
                        .then(codesData => {
                            const validCode = codesData.validCodes.find(
                                c => c.code.toUpperCase() === trimmedCode
                            );

                            if (validCode) {
                                this.currentReward = validCode;
                                this.showModal = true;
                                
                                setTimeout(() => {
                                    this.userInput = '';
                                    this.error = null;
                                }, 500);
                            } else {
                                this.error = `Invalid code "${trimmedCode}". Try again! 😅`;
                            }

                        })
                        .catch(err => {
                            console.error('Error fetching codes:', err);
                            this.error = 'Oops! Something went wrong. Check your connection.';
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                },

                closeModal() {
                    this.showModal = false;
                    
                    setTimeout(() => {
                        this.userInput = '';
                        this.error = null;
                    }, 300);
                }
            };
            
            // Bind data to Alpine
            const appInstance = Alpine.data('redeemApp', () => data)();
        }
    }
});

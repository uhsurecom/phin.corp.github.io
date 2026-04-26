document.addEventListener('alpine:init', () => {
    Alpine.data('redeemApp', () => ({
        userInput: '',
        error: null,
        loading: false,
        showModal: false,
        currentReward: {},

        init() {
            // Optional: Add keyboard shortcut to focus input
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

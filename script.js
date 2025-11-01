// Vocabulary highlighting functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeAccordion();
    initializeVocabularyHighlighting();
    initializeGrammarHighlighting();
    initializeSmoothScrolling();
    initializeInkEffect();
});

// Initialize accordion functionality
function initializeAccordion() {
    const accordionToggles = document.querySelectorAll('.accordion-toggle');
    
    accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all accordions first if needed, or toggle just this one
            if (!isActive) {
                // Close other accordions (optional - remove if you want multiple open)
                accordionToggles.forEach(otherToggle => {
                    if (otherToggle !== this && otherToggle.classList.contains('active')) {
                        otherToggle.classList.remove('active');
                        otherToggle.nextElementSibling.classList.remove('active');
                    }
                });
                
                // Open this accordion
                this.classList.add('active');
                content.classList.add('active');
            } else {
                // Close this accordion
                this.classList.remove('active');
                content.classList.remove('active');
            }
        });
    });
    
    // Open first section by default
    if (accordionToggles.length > 0) {
        accordionToggles[0].classList.add('active');
        accordionToggles[0].nextElementSibling.classList.add('active');
    }
}

// Function to open a specific accordion section by ID
function openAccordionSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const toggle = section.querySelector('.accordion-toggle');
    const content = section.querySelector('.accordion-content');
    
    if (toggle && content) {
        // Check if already open
        if (!toggle.classList.contains('active')) {
            // Close other accordions if needed (optional - remove if you want multiple open)
            document.querySelectorAll('.accordion-toggle').forEach(otherToggle => {
                if (otherToggle !== toggle && otherToggle.classList.contains('active')) {
                    otherToggle.classList.remove('active');
                    otherToggle.nextElementSibling.classList.remove('active');
                }
            });
            
            // Open this accordion
            toggle.classList.add('active');
            content.classList.add('active');
        }
    }
}

// Vocabulary highlighting
function initializeVocabularyHighlighting() {
    const vocabItems = document.querySelectorAll('.vocab-item');
    
    vocabItems.forEach(item => {
        item.addEventListener('click', function() {
            const highlightWord = this.getAttribute('data-highlight');
            
            // Ensure Original Text section is open
            openAccordionSection('original-text');
            
            // Remove previous highlights
            removeAllHighlights();
            
            // Add highlight to vocab item
            this.classList.add('highlight-active');
            
            // Small delay to ensure accordion animation completes before highlighting
            setTimeout(() => {
                // Highlight word in original text
                highlightWordInText(highlightWord);
            }, 100);
            
            // Remove highlight after animation
            setTimeout(() => {
                this.classList.remove('highlight-active');
            }, 1000);
        });
        
        // Hover effect to preview
        item.addEventListener('mouseenter', function() {
            const highlightWord = this.getAttribute('data-highlight');
            previewHighlightInText(highlightWord);
        });
        
        item.addEventListener('mouseleave', function() {
            removePreviewHighlights();
        });
    });
}

// Grammar highlighting
function initializeGrammarHighlighting() {
    const grammarItems = document.querySelectorAll('.grammar-item');
    
    grammarItems.forEach(item => {
        item.addEventListener('click', function() {
            const highlightPhrase = this.getAttribute('data-highlight');
            
            // Ensure Original Text section is open
            openAccordionSection('original-text');
            
            // Remove previous highlights
            removeAllHighlights();
            
            // Add highlight to grammar item
            this.classList.add('highlight-active');
            
            // Small delay to ensure accordion animation completes before highlighting
            setTimeout(() => {
                // Highlight phrase in original text
                highlightPhraseInText(highlightPhrase);
            }, 100);
            
            // Remove highlight after animation
            setTimeout(() => {
                this.classList.remove('highlight-active');
            }, 1200);
        });
    });
}

// Highlight specific word in original text
function highlightWordInText(word) {
    const verses = document.querySelectorAll('.verse');
    let firstMatch = null;
    
    verses.forEach((verse, index) => {
        // Store original HTML if not already stored
        if (!verse.dataset.originalHTML) {
            verse.dataset.originalHTML = verse.innerHTML;
        }
        
        // Restore original HTML first
        verse.innerHTML = verse.dataset.originalHTML;
        const text = verse.textContent || verse.innerText;
        
        // Escape special regex characters and handle apostrophes
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Use word boundary but allow for apostrophes
        const regex = new RegExp(`(^|[^\\w'])(${escapedWord})([^\\w']|$)`, 'gi');
        
        if (regex.test(text)) {
            // Reset regex
            const regex2 = new RegExp(`(^|[^\\w'])(${escapedWord})([^\\w']|$)`, 'gi');
            const newHTML = verse.innerHTML.replace(regex2, (match, before, wordMatch, after) => {
                return `${before}<span class="highlight-text">${wordMatch}</span>${after}`;
            });
            
            verse.innerHTML = newHTML;
            verse.classList.add('highlight-word');
            
            // Track first match for scrolling
            if (firstMatch === null) {
                firstMatch = verse;
            }
        }
    });
    
    // Scroll to first match
    if (firstMatch) {
        // Wait a bit longer to ensure accordion is fully open
        setTimeout(() => {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        
        // Remove highlight after animation
        setTimeout(() => {
            verses.forEach(verse => {
                verse.classList.remove('highlight-word');
                if (verse.dataset.originalHTML) {
                    verse.innerHTML = verse.dataset.originalHTML;
                }
            });
        }, 3000); // Keep highlight longer for better visibility
    }
}

// Highlight phrase in text (for grammar examples)
function highlightPhraseInText(phraseKey) {
    const verses = document.querySelectorAll('.verse');
    let firstMatch = null;
    
    // Define phrase mappings
    const phraseMappings = {
        'thy': ['thy', 'thou', 'thee', 'thine'],
        'stay\'d': ['stay\'d', 'unproportion\'d', 'unfledg\'d', 'express\'d'],
        'look-thou': ['Look thou character'],
        'give-thy-thoughts': ['Give thy thoughts no tongue'],
        'grapple-them': ['Grapple them unto thy soul with hoops of steel'],
        'costly-thy-habit': ['Costly thy habit as thy purse can buy'],
        'neither-nor': ['Neither a borrower nor a lender be'],
        'it-must-follow': ['as the night the day']
    };
    
    const searchTerms = phraseMappings[phraseKey] || [phraseKey];
    
    verses.forEach(verse => {
        // Store original HTML if not already stored
        if (!verse.dataset.originalHTML) {
            verse.dataset.originalHTML = verse.innerHTML;
        }
        
        // Restore original HTML first
        verse.innerHTML = verse.dataset.originalHTML;
        const text = verse.textContent || verse.innerText;
        
        searchTerms.forEach(term => {
            // Escape special regex characters
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedTerm, 'gi');
            
            if (regex.test(text) && firstMatch === null) {
                firstMatch = verse;
                verse.classList.add('highlight-word');
                
                // Reset regex for replacement
                const regex2 = new RegExp(escapedTerm, 'gi');
                const newHTML = verse.innerHTML.replace(regex2, (match) => {
                    return `<span class="highlight-text">${match}</span>`;
                });
                verse.innerHTML = newHTML;
            }
        });
    });
    
    // Scroll to match
    if (firstMatch) {
        // Wait a bit longer to ensure accordion is fully open
        setTimeout(() => {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        
        // Remove highlight after animation
        setTimeout(() => {
            verses.forEach(verse => {
                verse.classList.remove('highlight-word');
                if (verse.dataset.originalHTML) {
                    verse.innerHTML = verse.dataset.originalHTML;
                }
            });
        }, 3000); // Keep highlight longer for better visibility
    }
}

// Preview highlight on hover
function previewHighlightInText(word) {
    const verses = document.querySelectorAll('.verse');
    
    verses.forEach(verse => {
        // Store original HTML if not already stored
        if (!verse.dataset.originalHTML) {
            verse.dataset.originalHTML = verse.innerHTML;
        }
        
        // Don't preview if already highlighted
        if (verse.classList.contains('highlight-word')) {
            return;
        }
        
        const text = verse.textContent || verse.innerText;
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|[^\\w'])(${escapedWord})([^\\w']|$)`, 'gi');
        
        if (regex.test(text)) {
            // Reset regex
            const regex2 = new RegExp(`(^|[^\\w'])(${escapedWord})([^\\w']|$)`, 'gi');
            const newHTML = verse.innerHTML.replace(regex2, (match, before, wordMatch, after) => {
                return `${before}<span style="background: linear-gradient(180deg, transparent 0%, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.2) 100%, transparent 100%); padding: 1px 2px; border-radius: 2px; transition: all 0.3s;">${wordMatch}</span>${after}`;
            });
            verse.innerHTML = newHTML;
        }
    });
}

// Remove preview highlights
function removePreviewHighlights() {
    const verses = document.querySelectorAll('.verse');
    verses.forEach(verse => {
        // Only remove if not actively highlighting
        if (!verse.classList.contains('highlight-word')) {
            if (verse.dataset.originalHTML) {
                verse.innerHTML = verse.dataset.originalHTML;
            }
        }
    });
}

// Remove all active highlights
function removeAllHighlights() {
    document.querySelectorAll('.highlight-active').forEach(el => {
        el.classList.remove('highlight-active');
    });
    
    document.querySelectorAll('.verse').forEach(verse => {
        verse.classList.remove('highlight-word');
        // Restore original HTML if stored
        if (verse.dataset.originalHTML) {
            verse.innerHTML = verse.dataset.originalHTML;
        }
    });
}

// Smooth scrolling for better UX
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Ink pen effect on text selection
function initializeInkEffect() {
    const page = document.querySelector('.page');
    
    // Add subtle ink effect on text selection
    document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            // Add a subtle visual feedback
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            // Create a temporary highlight effect
            createInkSplash(rect.left + rect.width / 2, rect.top + window.scrollY);
        }
    });
}

// Create ink splash effect
function createInkSplash(x, y) {
    const splash = document.createElement('div');
    splash.style.position = 'absolute';
    splash.style.left = x + 'px';
    splash.style.top = y + 'px';
    splash.style.width = '20px';
    splash.style.height = '20px';
    splash.style.borderRadius = '50%';
    splash.style.background = 'radial-gradient(circle, rgba(139, 115, 85, 0.3), transparent)';
    splash.style.pointerEvents = 'none';
    splash.style.animation = 'inkFade 0.8s ease-out forwards';
    splash.style.zIndex = '1000';
    
    document.body.appendChild(splash);
    
    setTimeout(() => {
        splash.remove();
    }, 800);
}

// Add ink fade animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes inkFade {
        0% {
            transform: scale(0);
            opacity: 0.6;
        }
        50% {
            transform: scale(1.5);
            opacity: 0.3;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


console.log('📚 ECG Reading Materials loaded successfully!');
console.log('💡 Tip: Click on vocabulary or grammar items to see them highlighted in the text!');


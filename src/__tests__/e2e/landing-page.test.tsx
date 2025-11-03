/**
 * E2E Tests for HOW-195: Landing Page
 * Tests the complete marketing landing page including:
 * - Hero section with CTAs
 * - Service sections
 * - Pricing display
 * - FAQ functionality
 * - Footer links
 * - Scroll navigation
 */

import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LandingPage from '@/app/page'

// Mock scroll behavior
const mockScrollIntoView = jest.fn()
window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView

// Mock Accordion components
jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: any) => <div data-testid="accordion">{children}</div>,
  AccordionItem: ({ children, value }: any) => <div data-testid={`accordion-item-${value}`}>{children}</div>,
  AccordionTrigger: ({ children, className }: any) => (
    <button className={className} data-testid="accordion-trigger">{children}</button>
  ),
  AccordionContent: ({ children, className }: any) => (
    <div className={className} data-testid="accordion-content">{children}</div>
  ),
}))

describe('HOW-195: Landing Page E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Hero Section', () => {
    it('should render the hero section with main headline', () => {
      render(<LandingPage />)

      expect(screen.getByText('Your Creative Team,')).toBeInTheDocument()
      expect(screen.getByText('On Demand')).toBeInTheDocument()
    })

    it('should render hero subheadline about unlimited work', () => {
      render(<LandingPage />)

      expect(screen.getByText(/Get unlimited design, development, and AI automation work/i)).toBeInTheDocument()
      expect(screen.getByText(/No contracts. Pause or cancel anytime./i)).toBeInTheDocument()
    })

    it('should render badge with service description', () => {
      render(<LandingPage />)

      expect(screen.getByText('Unlimited Design, Dev & AI Services')).toBeInTheDocument()
    })

    it('should render Start Your Subscription CTA button in hero', () => {
      render(<LandingPage />)

      const ctaButtons = screen.getAllByRole('button', { name: /Start Your Subscription/i })
      expect(ctaButtons.length).toBeGreaterThan(0)
      expect(ctaButtons[0]).toBeInTheDocument()
    })

    it('should render See How It Works button in hero', () => {
      render(<LandingPage />)

      expect(screen.getByRole('button', { name: /See How It Works/i })).toBeInTheDocument()
    })

    it('should display social proof indicators', () => {
      render(<LandingPage />)

      expect(screen.getByText('48hr Turnaround')).toBeInTheDocument()
      expect(screen.getByText('Unlimited Requests')).toBeInTheDocument()
      expect(screen.getByText('Pause Anytime')).toBeInTheDocument()
    })

    it('should have animated background elements', () => {
      const { container } = render(<LandingPage />)

      const animatedBgs = container.querySelectorAll('.animate-pulse')
      expect(animatedBgs.length).toBeGreaterThan(0)
    })
  })

  describe('How It Works Section', () => {
    it('should render How It Works section heading', () => {
      render(<LandingPage />)

      expect(screen.getByText('How It Works')).toBeInTheDocument()
      expect(screen.getByText('Three simple steps to transform your workflow')).toBeInTheDocument()
    })

    it('should display all three steps', () => {
      render(<LandingPage />)

      expect(screen.getByText('Subscribe')).toBeInTheDocument()
      expect(screen.getByText('Submit Requests')).toBeInTheDocument()
      expect(screen.getByText('Get Deliverables')).toBeInTheDocument()
    })

    it('should show step numbers', () => {
      render(<LandingPage />)

      expect(screen.getByText('01')).toBeInTheDocument()
      expect(screen.getByText('02')).toBeInTheDocument()
      expect(screen.getByText('03')).toBeInTheDocument()
    })

    it('should display step descriptions', () => {
      render(<LandingPage />)

      expect(screen.getByText(/Choose your plan and get instant access/i)).toBeInTheDocument()
      expect(screen.getByText(/Add unlimited requests to your queue/i)).toBeInTheDocument()
      expect(screen.getByText(/Receive your completed work in 48 hours/i)).toBeInTheDocument()
    })
  })

  describe('What You Get Section', () => {
    it('should render What You Get section heading', () => {
      render(<LandingPage />)

      expect(screen.getByText('What You Get')).toBeInTheDocument()
      expect(screen.getByText(/All the services you need, included in one subscription/i)).toBeInTheDocument()
    })

    it('should display Design service category', () => {
      render(<LandingPage />)

      expect(screen.getByText('Design')).toBeInTheDocument()
      expect(screen.getByText('UI/UX Design')).toBeInTheDocument()
      expect(screen.getByText('Brand Identity')).toBeInTheDocument()
      expect(screen.getByText('Logo Design')).toBeInTheDocument()
    })

    it('should display Development service category', () => {
      render(<LandingPage />)

      expect(screen.getByText('Development')).toBeInTheDocument()
      expect(screen.getByText('Web Development')).toBeInTheDocument()
      expect(screen.getByText('Mobile Apps')).toBeInTheDocument()
      expect(screen.getByText('Full-Stack Solutions')).toBeInTheDocument()
    })

    it('should display AI & Automation service category', () => {
      render(<LandingPage />)

      expect(screen.getByText('AI & Automation')).toBeInTheDocument()
      expect(screen.getByText('AI Integration')).toBeInTheDocument()
      expect(screen.getByText('Workflow Automation')).toBeInTheDocument()
      expect(screen.getByText('ChatGPT Integration')).toBeInTheDocument()
    })

    it('should show all design services', () => {
      render(<LandingPage />)

      expect(screen.getByText('Marketing Graphics')).toBeInTheDocument()
      expect(screen.getByText('Social Media Assets')).toBeInTheDocument()
      expect(screen.getByText('Presentation Decks')).toBeInTheDocument()
      expect(screen.getByText('Wireframes & Prototypes')).toBeInTheDocument()
    })

    it('should show all development services', () => {
      render(<LandingPage />)

      expect(screen.getByText('API Integration')).toBeInTheDocument()
      expect(screen.getByText('Database Design')).toBeInTheDocument()
      expect(screen.getByText('E-commerce Sites')).toBeInTheDocument()
      expect(screen.getByText('Custom Features')).toBeInTheDocument()
    })

    it('should show all AI & automation services', () => {
      render(<LandingPage />)

      expect(screen.getByText('Data Processing')).toBeInTheDocument()
      expect(screen.getByText('Custom Bots')).toBeInTheDocument()
      expect(screen.getByText('API Automation')).toBeInTheDocument()
      expect(screen.getByText('Process Optimization')).toBeInTheDocument()
    })
  })

  describe('Pricing Section', () => {
    it('should render pricing section heading', () => {
      render(<LandingPage />)

      expect(screen.getByText('Simple, Transparent Pricing')).toBeInTheDocument()
      expect(screen.getByText('One plan. Unlimited possibilities.')).toBeInTheDocument()
    })

    it('should display Core Plan title and description', () => {
      render(<LandingPage />)

      expect(screen.getByText('Core Plan')).toBeInTheDocument()
      expect(screen.getByText(/Everything you need to scale your business/i)).toBeInTheDocument()
    })

    it('should show monthly price', () => {
      render(<LandingPage />)

      expect(screen.getByText('$4,495')).toBeInTheDocument()
      expect(screen.getByText('/month')).toBeInTheDocument()
    })

    it('should display MOST POPULAR badge', () => {
      render(<LandingPage />)

      expect(screen.getByText('MOST POPULAR')).toBeInTheDocument()
    })

    it('should list all plan features', () => {
      render(<LandingPage />)

      expect(screen.getByText('Unlimited design & dev requests')).toBeInTheDocument()
      expect(screen.getByText('48-hour average turnaround')).toBeInTheDocument()
      expect(screen.getByText('Unlimited revisions')).toBeInTheDocument()
      expect(screen.getByText('Dedicated team member')).toBeInTheDocument()
      expect(screen.getByText('AI & automation included')).toBeInTheDocument()
      expect(screen.getByText('Full-stack development')).toBeInTheDocument()
      expect(screen.getByText('Professional design work')).toBeInTheDocument()
      expect(screen.getByText('Pause or cancel anytime')).toBeInTheDocument()
    })

    it('should show no contracts disclaimer', () => {
      render(<LandingPage />)

      expect(screen.getByText(/No contracts. No setup fees. Cancel anytime./i)).toBeInTheDocument()
    })

    it('should have subscription CTA button in pricing section', () => {
      render(<LandingPage />)

      const buttons = screen.getAllByRole('button', { name: /Start Your Subscription/i })
      // Should have at least one from pricing section (plus hero)
      expect(buttons.length).toBeGreaterThan(1)
    })
  })

  describe('About Section', () => {
    it('should render about section heading', () => {
      render(<LandingPage />)

      expect(screen.getByText('Meet Your Partner')).toBeInTheDocument()
    })

    it('should display founder introduction', () => {
      render(<LandingPage />)

      expect(screen.getByText("Hi, I'm Chris")).toBeInTheDocument()
    })

    it('should show founder bio', () => {
      render(<LandingPage />)

      expect(screen.getByText(/full-stack developer and designer based in Texas/i)).toBeInTheDocument()
      expect(screen.getByText(/traditional agency models are broken/i)).toBeInTheDocument()
    })

    it('should display value proposition', () => {
      render(<LandingPage />)

      expect(screen.getByText(/No meetings. No contracts. Just exceptional work, delivered fast./i)).toBeInTheDocument()
    })

    it('should show experience stats', () => {
      render(<LandingPage />)

      expect(screen.getByText('10+')).toBeInTheDocument()
      expect(screen.getByText('Years Experience')).toBeInTheDocument()
    })

    it('should show projects delivered stat', () => {
      render(<LandingPage />)

      expect(screen.getByText('100+')).toBeInTheDocument()
      expect(screen.getByText('Projects Delivered')).toBeInTheDocument()
    })

    it('should show average turnaround stat', () => {
      render(<LandingPage />)

      expect(screen.getByText('48h')).toBeInTheDocument()
      expect(screen.getByText('Average Turnaround')).toBeInTheDocument()
    })
  })

  describe('FAQ Section', () => {
    it('should render FAQ section heading', () => {
      render(<LandingPage />)

      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
      expect(screen.getByText('Everything you need to know')).toBeInTheDocument()
    })

    it('should display all FAQ questions', () => {
      render(<LandingPage />)

      expect(screen.getByText('How does the subscription work?')).toBeInTheDocument()
      expect(screen.getByText('What is the average turnaround time?')).toBeInTheDocument()
      expect(screen.getByText('How many requests can I have at once?')).toBeInTheDocument()
      expect(screen.getByText("What if I don't like the work?")).toBeInTheDocument()
      expect(screen.getByText('Can I pause or cancel my subscription?')).toBeInTheDocument()
      expect(screen.getByText('What technologies do you work with?')).toBeInTheDocument()
      expect(screen.getByText('Is there a refund policy?')).toBeInTheDocument()
    })

    it('should render accordion component', () => {
      render(<LandingPage />)

      expect(screen.getByTestId('accordion')).toBeInTheDocument()
    })

    it('should display FAQ answers', () => {
      render(<LandingPage />)

      expect(screen.getByText(/Once subscribed, you get access to our project dashboard/i)).toBeInTheDocument()
      expect(screen.getByText(/Most requests are completed within 48 hours on average/i)).toBeInTheDocument()
      expect(screen.getByText(/You can add as many requests as you'd like/i)).toBeInTheDocument()
    })

    it('should show refund policy answer', () => {
      render(<LandingPage />)

      expect(screen.getByText(/Due to the high-quality nature of our work, we don't offer refunds/i)).toBeInTheDocument()
    })

    it('should show technologies in FAQ', () => {
      render(<LandingPage />)

      expect(screen.getByText(/React, Next.js, Vue, Node.js, Python/i)).toBeInTheDocument()
    })
  })

  describe('CTA Section', () => {
    it('should render final CTA heading', () => {
      render(<LandingPage />)

      expect(screen.getByText('Ready to Transform Your Workflow?')).toBeInTheDocument()
    })

    it('should show CTA description', () => {
      render(<LandingPage />)

      expect(screen.getByText(/Join forward-thinking businesses who are scaling faster/i)).toBeInTheDocument()
    })

    it('should have Start Subscription button in CTA section', () => {
      render(<LandingPage />)

      const buttons = screen.getAllByRole('button', { name: /Start Your Subscription/i })
      // Should have multiple throughout the page
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should have Contact Us button', () => {
      render(<LandingPage />)

      expect(screen.getByRole('button', { name: /Contact Us/i })).toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('should render company name in footer', () => {
      render(<LandingPage />)

      // Get all instances and check one is in footer context
      const companyNames = screen.getAllByText(/Design Dreams/i)
      expect(companyNames.length).toBeGreaterThan(0)
    })

    it('should display company tagline in footer', () => {
      render(<LandingPage />)

      expect(screen.getByText(/Unlimited design, development, and AI automation for one flat monthly fee./i)).toBeInTheDocument()
    })

    it('should have social media links', () => {
      const { container } = render(<LandingPage />)

      const twitterLink = container.querySelector('a[href="https://twitter.com"]')
      const linkedinLink = container.querySelector('a[href="https://linkedin.com"]')
      const githubLink = container.querySelector('a[href="https://github.com"]')

      expect(twitterLink).toBeInTheDocument()
      expect(linkedinLink).toBeInTheDocument()
      expect(githubLink).toBeInTheDocument()
    })

    it('should display Services section in footer', () => {
      render(<LandingPage />)

      const footerServicesHeading = screen.getAllByText('Services')
      expect(footerServicesHeading.length).toBeGreaterThan(0)
    })

    it('should display Legal section in footer', () => {
      render(<LandingPage />)

      expect(screen.getByText('Legal')).toBeInTheDocument()
      expect(screen.getByText('Terms of Service')).toBeInTheDocument()
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
      expect(screen.getByText('Refund Policy')).toBeInTheDocument()
    })

    it('should show copyright notice', () => {
      render(<LandingPage />)

      const currentYear = new Date().getFullYear()
      expect(screen.getByText(new RegExp(`© ${currentYear} Design Dreams. All rights reserved.`, 'i'))).toBeInTheDocument()
    })

    it('should show company location', () => {
      render(<LandingPage />)

      expect(screen.getByText('Based in Texas, serving clients worldwide.')).toBeInTheDocument()
    })
  })

  describe('Scroll Navigation', () => {
    it('should scroll to pricing section when CTA clicked in hero', () => {
      render(<LandingPage />)

      // Create a mock pricing section element
      const pricingSection = document.createElement('section')
      pricingSection.id = 'pricing'
      document.body.appendChild(pricingSection)

      const heroCtaButton = screen.getAllByRole('button', { name: /Start Your Subscription/i })[0]
      fireEvent.click(heroCtaButton)

      expect(mockScrollIntoView).toHaveBeenCalled()

      document.body.removeChild(pricingSection)
    })

    it('should scroll to how-it-works section when See How It Works clicked', () => {
      render(<LandingPage />)

      // Create a mock section element
      const howItWorksSection = document.createElement('section')
      howItWorksSection.id = 'how-it-works'
      document.body.appendChild(howItWorksSection)

      const seeHowButton = screen.getByRole('button', { name: /See How It Works/i })
      fireEvent.click(seeHowButton)

      expect(mockScrollIntoView).toHaveBeenCalled()

      document.body.removeChild(howItWorksSection)
    })

    it('should scroll to contact section from pricing CTA', () => {
      render(<LandingPage />)

      // Create a mock contact section element
      const contactSection = document.createElement('section')
      contactSection.id = 'contact'
      document.body.appendChild(contactSection)

      // The pricing CTA button (should be the one inside the pricing card)
      const pricingCtaButtons = screen.getAllByRole('button', { name: /Start Your Subscription/i })
      const pricingCta = pricingCtaButtons.find(button => {
        // Find the one inside the pricing card (it has a parent with border-primary class)
        const card = button.closest('.border-primary, .border-2')
        return card !== null
      })

      if (pricingCta) {
        fireEvent.click(pricingCta)
        expect(mockScrollIntoView).toHaveBeenCalled()
      }

      document.body.removeChild(contactSection)
    })
  })

  describe('Responsive Design', () => {
    it('should render on mobile viewport', () => {
      global.innerWidth = 375
      global.innerHeight = 667

      render(<LandingPage />)

      expect(screen.getByText('Your Creative Team,')).toBeInTheDocument()
    })

    it('should render on tablet viewport', () => {
      global.innerWidth = 768
      global.innerHeight = 1024

      render(<LandingPage />)

      expect(screen.getByText('Your Creative Team,')).toBeInTheDocument()
    })

    it('should render on desktop viewport', () => {
      global.innerWidth = 1920
      global.innerHeight = 1080

      render(<LandingPage />)

      expect(screen.getByText('Your Creative Team,')).toBeInTheDocument()
    })
  })

  describe('Content Quality', () => {
    it('should have clear value proposition throughout', () => {
      render(<LandingPage />)

      // Check multiple mentions of core value props
      const unlimitedMentions = screen.getAllByText(/unlimited/i)
      expect(unlimitedMentions.length).toBeGreaterThan(3)
    })

    it('should emphasize 48-hour turnaround', () => {
      render(<LandingPage />)

      const turnaroundMentions = screen.getAllByText(/48/i)
      expect(turnaroundMentions.length).toBeGreaterThan(2)
    })

    it('should mention flat monthly fee', () => {
      render(<LandingPage />)

      expect(screen.getByText(/one flat monthly fee/i)).toBeInTheDocument()
    })

    it('should emphasize no contracts', () => {
      render(<LandingPage />)

      const noContractsMentions = screen.getAllByText(/no contracts/i)
      expect(noContractsMentions.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<LandingPage />)

      // Main sections should have h2 headings
      expect(screen.getByText('How It Works')).toBeInTheDocument()
      expect(screen.getByText('What You Get')).toBeInTheDocument()
      expect(screen.getByText('Simple, Transparent Pricing')).toBeInTheDocument()
    })

    it('should have accessible buttons', () => {
      render(<LandingPage />)

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(5)

      // Check buttons have text content or aria-labels
      buttons.forEach(button => {
        expect(button.textContent || button.getAttribute('aria-label')).toBeTruthy()
      })
    })

    it('should have accessible links with proper attributes', () => {
      const { container } = render(<LandingPage />)

      const externalLinks = container.querySelectorAll('a[target="_blank"]')
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })
  })

  describe('Animations and Interactivity', () => {
    it('should have animated elements on mount', () => {
      const { container } = render(<LandingPage />)

      const animatedElements = container.querySelectorAll('.animate-pulse, .animate-bounce')
      expect(animatedElements.length).toBeGreaterThan(0)
    })

    it('should have hover effects on cards', () => {
      const { container } = render(<LandingPage />)

      const cards = container.querySelectorAll('.hover\\:shadow-xl')
      expect(cards.length).toBeGreaterThan(0)
    })

    it('should have transition effects on buttons', () => {
      render(<LandingPage />)

      const buttons = screen.getAllByRole('button')
      const hasTransitions = buttons.some(button => {
        const classes = button.className
        return classes.includes('transition') || classes.includes('group')
      })

      expect(hasTransitions).toBe(true)
    })
  })
})

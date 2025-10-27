import type { Service, FAQ, Testimonial } from './types';
import { BriefcaseIcon, BuildingIcon, ChartPieIcon, CheckCircleIcon, UsersIcon, FileTextIcon, LightBulbIcon, AcademicCapIcon } from './components/icons';

export const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Incorporations – Private Limited or LLP',
    description: 'Establish your business legally as a Private Limited company or an LLP.',
    commission: '20% on incorporation value + 10% on future services.',
    icon: BuildingIcon,
  },
  {
    id: 's2',
    name: 'GST Registration',
    description: 'Get your business GST registered and compliant from day one.',
    commission: '30% on registration + 10% recurring for monthly filings.',
    icon: FileTextIcon,
  },
  {
    id: 's3',
    name: 'PF / ESI and Labour Compliance',
    description: 'Manage your employee compliance with PF, ESI, and other labor laws.',
    commission: '30% on registration + 10% recurring for monthly filings.',
    icon: UsersIcon,
  },
  {
    id: 's4',
    name: 'Virtual Accounting Services',
    description: 'Outsource your bookkeeping, MIS reporting, and accounting needs.',
    commission: '1 Month Fee as commission, recurring annually.',
    icon: BriefcaseIcon,
  },
  {
    id: 's5',
    name: 'Virtual CFO Services',
    description: 'Strategic financial guidance without the cost of a full-time CFO.',
    commission: '1 Month Fee as commission, recurring annually.',
    icon: ChartPieIcon,
  },
   {
    id: 's6',
    name: 'Courses by Vision Connects',
    description: 'Professional development courses for students and businessmen.',
    commission: 'Flat 40% of the course value.',
    icon: AcademicCapIcon,
  },
  {
    id: 's7',
    name: 'MCA & ROC Compliance',
    description: 'Ensure your company meets all annual compliance requirements from the MCA & ROC.',
    commission: '15% on service value.',
    icon: CheckCircleIcon,
  },
  {
    id: 's8',
    name: 'Business Advisory',
    description: 'Expert advice to help you navigate business challenges and seize opportunities.',
    commission: '10% on advisory fees.',
    icon: LightBulbIcon,
  }
];

export const FAQS: FAQ[] = [
    {
        question: 'How do I join the referral program?',
        answer: 'Simply click on "Join Now" or "Sign in with Google" on our landing page. After a quick verification, you will get access to your dashboard and can start referring immediately.'
    },
    {
        question: 'When will I receive my reward?',
        answer: 'Commissions are marked as "Payable" in your wallet as soon as the referred client makes their full payment to us. Payouts are processed on a monthly basis after deducting TDS - 5%'
    },
    {
        question: 'Is there a limit on the number of referrals?',
        answer: 'Absolutely not! There is no limit to the number of clients you can refer or the amount of commission you can earn. The more you refer, the more you earn.'
    },
    {
        question: 'How does recurring commission work?',
        answer: 'If a client you refer avails a recurring service like GST filing or Virtual Accounting, you earn a commission not just on the initial setup but every time they renew or pay for the service, for the lifetime of the client with us.'
    }
];

export const TESTIMONIALS: Testimonial[] = [
    {
        id: 't1',
        quote: 'The referral program is straightforward and rewarding. It’s a great way to earn passive income by leveraging my professional network.',
        author: 'Srinivas',
        company: 'Tax Practitioner'
    },
    {
        id: 't2',
        quote: 'Accountants Factory helped my business stay compliant and focus on growth. Their team is professional and their services are top-notch.',
        author: 'Ashok',
        company: ' Accountant '
    },
    {
        id: 't3',
        quote: 'I\'ve referred several clients, and the process is seamless. The dashboard makes it easy to track everything from submission to payout.',
        author: 'Praneeth',
        company: 'Sr. Finance Executive'
    }
];

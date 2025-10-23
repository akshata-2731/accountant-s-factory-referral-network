// FIX: Import React to make its types available in this file.
import type React from 'react';

export enum ReferralStatus {
  LeadReceived = 'Lead Received',
  ProposalSent = 'Proposal Sent',
  Accepted = 'Accepted',
  WorkInProgress = 'Work in Progress',
  Completed = 'Completed',
  Paid = 'Paid',
}

export interface Service {
  id: string;
  name: string;
  description: string;
  commission: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Referral {
  id: string;
  clientName: string;
  dateSubmitted: string;
  status: ReferralStatus;
  expectedCommission: number;
  referrerName: string; // New field for admin view
  reminderDate?: string | null; // For the new reminder feature
  reminderNote?: string | null; // Note for the reminder
}

export interface CommissionWallet {
  totalEarned: number;
  pending: number;
  paid: number;
}

export interface Payout {
    id: string;
    date: string;
    clientName: string;
    amount: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Testimonial {
    id:string;
    quote: string;
    author: string;
    company: string;
}

export interface User {
    id: string;
    name: string;
    role: 'user' | 'admin';
    email?: string;
    isVerified: boolean;
    verificationToken?: string;
}

export interface AdminStats {
    totalReferrals: number;
    pendingCommission: number;
    conversionRate: number; // as a percentage
}
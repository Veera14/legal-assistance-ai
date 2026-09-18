export interface SampleDocument {
  id: string;
  title: string;
  category: "Lease" | "Employment & Freelance" | "NDA & Confidentiality" | "SaaS & Consumer";
  defaultRole: string;
  description: string;
  text: string;
}

export interface ComparisonPair {
  id: string;
  title: string;
  docALabel: string;
  docBLabel: string;
  userRole: string;
  description: string;
  docA: string;
  docB: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: "residential-lease",
    title: "Standard Residential Lease Agreement",
    category: "Lease",
    defaultRole: "Tenant",
    description: "12-month residential apartment lease with clauses covering security deposits, landlord entry, repairs, and renewal.",
    text: `RESIDENTIAL LEASE AGREEMENT

1. PARTIES & PREMISES
This Agreement is entered into on September 1, 2026, between Oakwood Realty LLC ("Landlord") and Jane Doe ("Tenant"). Landlord leases to Tenant Apartment 4B located at 742 Evergreen Terrace, Springfield ("Premises").

2. TERM & AUTOMATIC RENEWAL
The initial term shall commence on October 1, 2026, and expire on September 30, 2027. Unless Tenant provides written notice of intent to vacate at least sixty (60) days prior to the expiration date, this Lease shall automatically renew for successive one-year terms at a monthly rent rate increased by eight percent (8%).

3. RENT & LATE FEES
Tenant agrees to pay monthly rent of $2,250.00, due on or before the first (1st) day of each calendar month. If rent is not received by Landlord by 11:59 PM on the third (3rd) day of the month, a late fee of $125.00 shall immediately accrue, plus an additional penalty of $15.00 per day until paid in full.

4. SECURITY DEPOSIT
Tenant shall deposit with Landlord the sum of $3,500.00 as a security deposit. Landlord may withhold from said deposit amounts necessary to remedy Tenant defaults in rent, repair damages beyond normal wear and tear, and offset mandatory professional carpet steam-cleaning and repainting upon surrender, irrespective of condition. Deposit balance will be returned within 45 days of surrender.

5. ENTRY & INSPECTIONS
Landlord and its authorized agents shall have the right to enter the Premises at any reasonable time for inspection, maintenance, or showing to prospective buyers or renters, upon giving twenty-four (24) hours advance notice. In emergencies or suspected water leaks, Landlord may enter immediately without prior notice.

6. REPAIRS & MAINTENANCE
Tenant shall be responsible for all plumbing clogs, light bulb replacements, and any damage caused by negligence. Any repair costing less than $150.00 shall be the sole financial responsibility of Tenant. Tenant shall immediately notify Landlord in writing of any condition requiring major structural, electrical, or heating repairs.

7. OCCUPANCY & GUESTS
The Premises shall be occupied solely by Tenant. Overnight guests staying more than seven (7) consecutive nights or more than fourteen (14) nights in any calendar year shall require prior written consent of Landlord and may be deemed unauthorized occupants, subjecting Tenant to lease termination.

8. PETS
No animals, birds, or reptiles of any kind are permitted without an executed Pet Addendum and a non-refundable pet fee of $500.00 plus $50.00 monthly pet rent.

9. INDEMNIFICATION & LIABILITY
Tenant agrees to indemnify, defend, and hold harmless Landlord from any and all claims, damages, liabilities, and expenses (including reasonable attorneys' fees) arising out of or related to Tenant's use or occupancy of the Premises, except where caused by Landlord's willful gross negligence.

10. GOVERNING LAW & DISPUTES
This Agreement is governed by the laws of the State. Any dispute shall be resolved through binding arbitration in Springfield, and Tenant hereby waives any right to a jury trial or participation in any class action litigation against Landlord.`
  },
  {
    id: "freelance-contract",
    title: "Independent Contractor Services Agreement",
    category: "Employment & Freelance",
    defaultRole: "Independent Contractor / Freelancer",
    description: "Design and software services contract including IP assignment, indemnification, payment terms, and non-solicitation.",
    text: `INDEPENDENT CONTRACTOR SERVICES AGREEMENT

This Agreement is made as of October 15, 2026, by and between Apex Media Corp ("Client") and Alex Rivera ("Contractor").

1. SERVICES & DELIVERABLES
Contractor agrees to perform the digital design and software development services specified in Statement of Work #1 attached hereto. Contractor shall exercise professional discretion regarding the method and manner of performing the Services.

2. COMPENSATION & PAYMENT TERMS
Client shall compensate Contractor at the fixed project fee of $14,000.00. Payment shall be disbursed in installments: 20% upon signing, 30% upon midpoint deliverable acceptance, and 50% upon final completion. Client shall pay approved invoices within sixty (60) calendar days from receipt (Net 60). No interest shall accrue on overdue payments.

3. WORK PRODUCT & INTELLECTUAL PROPERTY
Contractor agrees that all deliverables, inventions, code, designs, and work product created in connection with this Agreement shall be considered "work made for hire." To the extent any deliverables do not qualify as work made for hire, Contractor irrevocably assigns to Client all right, title, and interest throughout the universe, including all copyright, patent, and trademark rights. Contractor waives all moral rights.

4. INDEPENDENT CONTRACTOR STATUS
Contractor is an independent contractor and not an employee, agent, or partner of Client. Contractor is solely responsible for all federal, state, and local income taxes, self-employment taxes, and workers' compensation insurance. Client shall not provide health insurance, retirement contributions, or paid leave.

5. INDEMNIFICATION & UNLIMITED LIABILITY
Contractor shall defend, indemnify, and hold harmless Client, its officers, directors, and affiliates against any and all losses, damages, liabilities, costs, and legal fees arising from Contractor's performance of Services, any alleged breach of warranty, or any claim that Contractor's work infringes any third-party intellectual property rights. Contractor's liability under this section shall be uncapped.

6. TERMINATION
Client may terminate this Agreement at any time, with or without cause, upon seven (7) days written notice. In such event, Client's sole obligation shall be to pay for hours completed up to the date of notice. Contractor may terminate only upon thirty (30) days written notice in the event of Client's uncured material breach.

7. NON-SOLICITATION & NON-COMPETE
During the term of this Agreement and for a period of twelve (12) months thereafter, Contractor shall not directly or indirectly solicit, contract with, or perform competitive services for any client or prospective client of Client with whom Contractor had contact during the engagement.

8. GOVERNING LAW & VENUE
This Agreement shall be governed by the laws of the State of Delaware, without regard to conflicts of law provisions. Venue for any dispute shall reside exclusively in Wilmington, Delaware.`
  },
  {
    id: "mutual-nda",
    title: "Mutual Non-Disclosure Agreement (NDA)",
    category: "NDA & Confidentiality",
    defaultRole: "Receiving / Disclosing Party",
    description: "Standard bilateral confidentiality agreement for commercial discussions, partnerships, or startup evaluations.",
    text: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of November 5, 2026, by and between CloudPulse Technologies Inc. and Horizon Ventures LLC (each a "Party", together the "Parties").

1. PURPOSE
The Parties wish to explore a potential strategic business collaboration ("Purpose") and may disclose confidential proprietary business, technical, and financial information.

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means all non-public information disclosed by one Party ("Disclosing Party") to the other ("Receiving Party"), whether orally, visually, or in writing, that is designated as confidential or reasonably understood to be confidential given the nature of the information.

3. EXCLUSIONS
Confidential Information does not include information that: (a) is or becomes publicly known through no breach by Receiving Party; (b) was already rightfully known prior to disclosure; (c) is independently developed without reference to Disclosing Party's information; or (d) is rightfully received from a third party without confidentiality obligations.

4. OBLIGATIONS & STANDARD OF CARE
Receiving Party shall: (i) protect Confidential Information with at least the same degree of care it uses for its own confidential information, but no less than reasonable care; (ii) not disclose Confidential Information to any third party except employees, contractors, and legal advisors who have a need to know and are bound by confidentiality terms at least as restrictive as this Agreement; and (iii) not use Confidential Information for any purpose outside the authorized Purpose.

5. TERM & SURVIVAL
This Agreement shall govern disclosures made for one (1) year from the Effective Date. The confidentiality obligations under Section 4 shall survive for three (3) years following the termination or expiration of this Agreement, except that trade secrets shall remain confidential in perpetuity.

6. RETURN OR DESTRUCTION
Upon Disclosing Party's written request, Receiving Party shall promptly return or certify destruction of all copies, excerpts, and summaries of Confidential Information, except for automated secure digital system backups made in the ordinary course of business.

7. NO LICENSE OR WARRANTY
Nothing in this Agreement grants any patent, copyright, or trademark license. All information is provided "AS IS" without warranties of accuracy or completeness.

8. REMEDIES & INJUNCTIVE RELIEF
The Parties acknowledge that unauthorized disclosure of Confidential Information will cause irreparable harm for which monetary damages alone would be inadequate. Disclosing Party shall be entitled to seek equitable relief, including temporary and permanent injunctions, without necessity of posting bond.`
  },
  {
    id: "saas-terms",
    title: "Cloud Service Terms of Service & End User Agreement",
    category: "SaaS & Consumer",
    defaultRole: "Customer / End User",
    description: "Consumer cloud application terms featuring auto-renewal, liability caps, unilateral modification, and arbitration waiver.",
    text: `CLOUD PLATFORM TERMS OF SERVICE

Effective Date: January 1, 2026

1. ACCEPTANCE OF TERMS
By accessing or using the NimbusCloud Platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not access or use the Service.

2. MODIFICATION OF TERMS
We reserve the right, at our sole discretion, to modify or replace these Terms at any time without individual prior notice. Your continued use of the Service following the posting of any changes constitutes binding acceptance of those changes.

3. SUBSCRIPTION BILLING & AUTO-RENEWAL
Paid subscriptions are billed on a recurring monthly or annual basis. YOUR SUBSCRIPTION WILL AUTOMATICALLY RENEW AT THE THEN-CURRENT RATE UNLESS CANCELLED AT LEAST FOURTEEN (14) DAYS PRIOR TO THE RENEWAL DATE THROUGH YOUR ACCOUNT SETTINGS. Fees are non-refundable except where required by applicable local law.

4. USER CONTENT & DATA LICENSE
You retain ownership of the data you upload to the Service. However, by uploading content, you grant NimbusCloud a worldwide, non-exclusive, royalty-free, transferable license to host, parse, cache, analyze, and create derivative analytical models from your content to maintain, enhance, and train machine learning algorithms supporting the Service.

5. RESTRICTIONS ON USE
You agree not to: (a) reverse engineer, decompile, or disassemble any portion of the Service; (b) use automated scrapers or bots; or (c) resell or redistribute the Service to any third party without written consent.

6. DISCLAIMER OF WARRANTIES
THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

7. LIMITATION OF LIABILITY
IN NO EVENT SHALL NIMBUSCLOUD OR ITS DIRECTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. OUR TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS SHALL NOT EXCEED THE AMOUNT PAID BY YOU IN THE THREE (3) MONTHS IMMEDIATELY PRECEDING THE CLAIM OR FIFTY DOLLARS ($50.00), WHICHEVER IS LESS.

8. MANDATORY ARBITRATION & CLASS ACTION WAIVER
YOU AND NIMBUSCLOUD AGREE THAT ANY DISPUTE ARISING OUT OF OR RELATING TO THESE TERMS SHALL BE RESOLVED BY BINDING INDIVIDUAL ARBITRATION RATHER THAN IN COURT. YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION, CLASS-WIDE ARBITRATION, OR PRIVATE ATTORNEY GENERAL ACTION.`
  }
];

export const SAMPLE_COMPARISON_PAIRS: ComparisonPair[] = [
  {
    id: "contractor-comparison",
    title: "Client-Favorable vs. Contractor-Protective Agreement",
    docALabel: "Client-Proposed Contract",
    docBLabel: "Protective Freelancer Contract",
    userRole: "Freelance Designer / Engineer",
    description: "Compare an aggressive client contract against a fair, balanced contractor agreement to spot liability and payment traps.",
    docA: `INDEPENDENT CONTRACTOR AGREEMENT (PROPOSAL A)
1. PAYMENT: Net 60 days following full deliverable sign-off. No milestone payments. Client retains right to dispute invoices without interest.
2. INTELLECTUAL PROPERTY: Contractor assigns all work product, source code, preliminary drafts, and underlying toolkits to Client permanently worldwide. Contractor waives all moral rights.
3. INDEMNIFICATION: Contractor shall indemnify and hold harmless Client against all claims, liabilities, damages, and legal costs with unlimited financial exposure.
4. TERMINATION: Client may terminate immediately without notice or penalty. Contractor may not terminate until all scheduled deliverables are accepted.
5. NON-COMPETE: Contractor shall not perform design services for any company in the same industry for 18 months following contract completion.`,
    docB: `FREELANCE PROFESSIONAL SERVICES AGREEMENT (PROPOSAL B)
1. PAYMENT: 30% deposit upon contract execution, 30% upon midway milestone, 40% upon final delivery. Invoices payable Net 15. Overdue invoices accrue interest at 1.5% per month.
2. INTELLECTUAL PROPERTY: Full copyright in final delivered assets transfers to Client upon receipt of final payment in full. Contractor retains ownership of pre-existing tools, libraries, and portfolio display rights.
3. INDEMNIFICATION: Mutual indemnification for gross negligence and direct IP infringement only. Contractor's total liability under this Agreement is strictly capped at the total fees paid.
4. TERMINATION: Either party may terminate with or without cause upon fourteen (14) days written notice, with Client paying pro-rata for all work performed to date.
5. RESTRAINTS OF TRADE: No non-compete clause. Contractor remains free to serve other clients, respecting strict client trade secrets and confidential information.`
  }
];

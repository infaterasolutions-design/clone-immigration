require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const updates = [
  // VISA
  { slug: 'visa', title: 'Latest US Visa News 2026 | New Visa Updates & Alerts & USCIS Updates', desc: 'Stay informed with new US visa updates, including recent rule changes, processing updates, and important announcements from USCIS and US immigration authorities.' },
  { slug: 'h-1b', title: 'U.S. H1B Visa News 2026 | Latest Updates Guide, Requirements & HB1 Eligibility', desc: 'Learn about H1B visa requirements, eligibility rules, and latest H1B visa updates for 2026. Get complete information on the HB1 visa application process and guidelines.' },
  { slug: 'f-1', title: 'F1 Visa News & Updates 2026 | Student Visa Rules & USCIS Updates', desc: 'Stay updated with the latest F1 visa news, student visa rules, OPT and CPT changes, SEVIS updates, visa approvals, delays, and USCIS announcements for 2026.' },
  { slug: 'b1-b2', title: 'B1/B2 Visa News & Updates 2026 | Visitor Visa Rules & USCIS Updates', desc: 'Get the latest B1 and B2 visa news, visitor visa policy updates, interview changes, approvals, refusals, extensions, travel rules, and U.S. immigration announcements for 2026.' },
  { slug: 'j-1', title: 'J1 Visa News & Updates 2026 | Exchange Visitor Rules & USCIS Updates', desc: 'Explore the latest J1 visa news, exchange visitor program updates, waiver policies, work authorization rules, interview changes, approvals, delays, and U.S. immigration updates for 2026.' },
  { slug: 'o-1', title: 'O1 Visa News & Updates 2026 | Extraordinary Ability Visa Rules', desc: 'Follow the latest O1 visa news, extraordinary ability visa updates, petition approvals, RFEs, processing delays, employer sponsorship rules, and USCIS policy changes for 2026.' },
  { slug: 'tourist-visas', title: 'Tourist & Travel Visa News 2026 | Visitor Visa Rules & Updates', desc: 'Get the latest tourist visa and travel visa news, visitor entry rules, interview updates, approvals, delays, travel restrictions, and U.S. immigration policy changes for 2026.' },
  { slug: 'visa-stamping', title: 'Visa Stamping News & Updates 2026 | Interview Rules & Processing', desc: 'Track the latest visa stamping news, interview waiver updates, Dropbox rules, appointment delays, consular processing changes, and U.S. visa approval updates for 2026.' },
  { slug: 'visa-refusals', title: 'Visa Refusal News & Updates 2026 | 214(b), Rejections & Appeals', desc: 'Stay updated on the latest U.S. visa refusal news, 214(b) rejection trends, embassy denial cases, refusal rates, consular decisions, waiver options, and immigration appeal updates in 2026.' },

  // GREEN CARD
  { slug: 'green-card', title: 'Green Card News & Updates 2026 | Processing Times & USCIS Updates', desc: 'Stay updated with the latest green card news and green card updates for 2026. Get information on green card processing times, policy changes, approvals, delays, and USCIS announcements.' },
  { slug: 'employment-based', title: 'Employment Based Visa News 2026 | EB Visa Updates & USCIS Changes', desc: 'Get the latest employment based visa news, EB visa updates, priority date movement, PERM labor changes, processing delays, approvals, and USCIS immigration policy updates for 2026.' },
  { slug: 'family-based', title: 'Family Based Visa News 2026 | Sponsorship & Immigration Updates', desc: 'Follow the latest family based visa news, family sponsorship updates, priority date changes, spouse and parent visa rules, processing delays, approvals, and USCIS announcements for 2026.' },
  { slug: 'perm-labor', title: 'PERM Labor News & Updates 2026 | PERM Processing & DOL Changes', desc: 'Get the latest PERM labor certification news, PERM processing updates, prevailing wage changes, audit trends, employer sponsorship rules, and Department of Labor updates for 2026.' },
  { slug: 'i-140', title: 'I-140 News & Updates 2026 | Immigrant Petition Processing', desc: 'Track the latest I-140 news, immigrant petition updates, premium processing changes, RFEs, approvals, denials, employer sponsorship rules, and USCIS processing updates for 2026.' },
  { slug: 'priority-dates', title: 'Priority Dates News & Updates 2026 | Visa Bulletin & Green Card Movement', desc: 'Follow the latest priority dates news, Visa Bulletin updates, green card cutoff movements, retrogression changes, EB and family category trends, and USCIS immigration updates for 2026.' },
  { slug: 'visa-bulletin', title: 'Visa Bulletin News & Updates 2026 | USCIS & Priority Date Changes', desc: 'Get the latest U.S. Visa Bulletin news, USCIS Visa Bulletin updates, F4 visa bulletin movement, priority date changes, retrogression alerts, and green card category updates for 2026.' },
  { slug: 'adjustment-of-status', title: 'Adjustment of Status News 2026 | Form I-485 & USCIS Updates', desc: 'Track the latest adjustment of status news, Form I-485 updates, green card application processing, interview changes, approvals, RFEs, delays, and USCIS policy updates for 2026.' },

  // USCIS
  { slug: 'uscis', title: 'USCIS News & Updates 2026 | Processing Times & Immigration Changes', desc: 'Get the latest USCIS news, USCIS processing time updates, immigration policy changes, case processing delays, approvals, forms, and official announcements for 2026.' },
  { slug: 'processing-times', title: 'USCIS Processing Times 2026 | Case Delays & Immigration Updates', desc: 'Follow the latest USCIS processing times, case delay updates, approval timelines, green card and visa application trends, and immigration processing changes for 2026.' },
  { slug: 'work-permits-ead', title: 'Work Permit & Work Visa News 2026 | Employment Authorization Updates', desc: 'Get the latest work permit and work visa news, employment authorization updates, EAD processing changes, visa approvals, delays, and USCIS immigration policy updates for 2026.' },
  { slug: 'biometrics', title: 'USCIS Biometrics News 2026 | Appointment & Fingerprinting Updates', desc: 'Track the latest USCIS biometrics news, biometrics appointment updates, fingerprinting rules, rescheduling policies, delays, and immigration processing changes for 2026.' },
  { slug: 'citizenship', title: 'U.S. Citizenship News & Updates 2026 | Naturalization & USCIS Changes', desc: 'Get the latest U.S. citizenship news, naturalization updates, N-400 processing changes, interview rules, oath ceremony updates, approvals, delays, and USCIS announcements for 2026.' },
  { slug: 'n-400', title: 'N-400 News & Updates 2026 | Citizenship Application & USCIS Changes', desc: 'Follow the latest N-400 news, citizenship application updates, naturalization interview changes, processing delays, approvals, oath ceremony updates, and USCIS announcements for 2026.' },
  { slug: 'policy-updates', title: 'U.S. Immigration Policy Updates 2026 | USCIS & Visa Rule Changes', desc: 'Explore the latest U.S. immigration policy updates, USCIS rule changes, visa regulations, green card reforms, travel policies, and federal immigration announcements for 2026.' },
  { slug: 'forms-filing', title: 'USCIS Forms & Filing Updates 2026 | Immigration Application News', desc: 'Get the latest USCIS forms and filing updates, immigration application changes, filing fee updates, form revisions, submission rules, processing changes, and USCIS announcements for 2026.' },

  // ICE & BORDER
  { slug: 'ice-border', title: 'ICE & Border News 2026 | Immigration Enforcement & Policy Updates', desc: 'Follow the latest ICE news, border enforcement updates, detention policies, deportation actions, migrant processing changes, and U.S. immigration enforcement developments for 2026.' },
  { slug: 'deportation', title: 'Deportation News & Updates 2026 | Removal Policies & Immigration Changes', desc: 'Get the latest deportation news, removal policy updates, ICE enforcement actions, immigration court developments, detention changes, and U.S. immigration updates for 2026.' },
  { slug: 'ice-enforcement', title: 'ICE Enforcement News 2026 | Deportation Raids & ICE Updates', desc: 'Get the latest ICE enforcement news, deportation operations, ICE agent activity, detention policies, border actions, and U.S. immigration enforcement updates for 2026.' },
  { slug: 'border-security', title: 'Border Security News & Updates 2026 | U.S. Immigration & Enforcement', desc: 'Follow the latest border security news, U.S. border enforcement updates, migrant policies, detention changes, wall and surveillance developments, and federal immigration announcements for 2026.' },
  { slug: 'cbp-updates', title: 'CBP Updates 2026 | Border Protection & Travel Policy News', desc: 'Get the latest CBP updates, border protection news, customs and travel policy changes, port of entry rules, inspection procedures, and U.S. immigration enforcement developments for 2026.' },
  { slug: 'migrant-policies', title: 'Migrant Policy News & Updates | U.S. Border & Immigration Changes', desc: 'Explore the latest migrant policy news, asylum rule changes, border enforcement updates, detention policies, humanitarian programs, and federal immigration developments affecting migrants in the U.S.' },
  { slug: 'detention-news', title: 'ICE Detention News & Updates | Immigration Custody & Enforcement', desc: 'Track the latest ICE detention news, immigration custody policies, detention center updates, release rules, enforcement actions, and federal immigration developments across the U.S.' },

  // STUDENTS
  { slug: 'students', title: 'International Student Visa News & Updates | F1 Visa & U.S. Education Rules', desc: 'Get the latest international student news, F1 visa updates, SEVIS changes, OPT and CPT rules, student work policies, and U.S. immigration developments affecting students.' },
  { slug: 'opt', title: 'OPT & I-765 News | Work Authorization & USCIS Updates', desc: 'Follow the latest OPT news, Form I-765 updates, EAD processing changes, work authorization rules, approval timelines, delays, and USCIS immigration announcements.' },
  { slug: 'cpt', title: 'CPT News & Updates | Student Work Authorization Rules', desc: 'Get the latest CPT news, Curricular Practical Training updates, F1 student work rules, internship authorization changes, SEVIS policies, and USCIS immigration developments.' },
  { slug: 'stem-opt', title: 'STEM OPT News & Updates | Extension Rules & USCIS Changes', desc: 'Track the latest STEM OPT news, extension application updates, work authorization rules, employer requirements, EAD processing changes, and USCIS announcements for international students.' },
  { slug: 'sevis', title: 'SEVIS News & Fee Updates | Student Visa & DHS Rules', desc: 'Get the latest SEVIS news, SEVIS fee updates, student visa compliance rules, DHS policy changes, payment requirements, and immigration updates for F1 and J1 students.' },
  { slug: 'student-visas', title: 'Student Visa News & Updates | F1 Visa Rules & USCIS Changes', desc: 'Follow the latest student visa news, F1 visa USA updates, SEVIS changes, interview policies, OPT and CPT rules, approvals, delays, and U.S. immigration announcements.' },
  { slug: 'dhs-student-rules', title: 'DHS Student Rules & Updates | F1 Visa & SEVIS Policies', desc: 'Explore the latest DHS student rule updates, F1 visa policy changes, SEVIS regulations, work authorization rules, compliance requirements, and U.S. immigration developments for students.' },

  // ASYLUM & REFUGEES
  { slug: 'asylum-refugees', title: 'Asylum & Refugee Policy News | Protection Rules & Immigration Updates', desc: 'Track the latest asylum and refugee policy news, humanitarian protection rules, refugee programs, court decisions, border asylum changes, and U.S. immigration developments.' },
  { slug: 'asylum', title: 'Asylum News & Updates | Refugee Protection & Immigration Policies', desc: 'Get the latest asylum news, refugee protection updates, border asylum rules, court decisions, humanitarian programs, and U.S. immigration policy developments.' },
  { slug: 'tps', title: 'TPS News & Updates | Temporary Protected Status & USCIS Changes', desc: 'Follow the latest TPS news, USCIS Temporary Protected Status updates, country redesignations, work permit rules, TPS to green card developments, and immigration policy changes.' },
  { slug: 'refugee-programs', title: 'Refugee Program Updates | Humanitarian Policies & Immigration News', desc: 'Track the latest refugee program updates, humanitarian admissions policies, resettlement changes, refugee protection rules, and U.S. immigration developments affecting refugees.' },
  { slug: 'humanitarian-parole', title: 'Humanitarian Parole News | USCIS Programs & Immigration Updates', desc: 'Get the latest humanitarian parole news, USCIS parole program updates, sponsorship rules, travel authorization changes, eligibility requirements, and U.S. immigration policy developments.' },
  { slug: 'work-authorization', title: 'Form I-765 & Work Authorization News | EAD & USCIS Updates', desc: 'Get the latest Form I-765 news, work authorization updates, EAD processing changes, approval timelines, renewal policies, delays, and USCIS immigration announcements.' },
  { slug: 'court-decisions', title: 'Immigration Court Decisions | Federal Rulings & Legal Updates', desc: 'Track major immigration court decisions, federal rulings, visa and asylum case outcomes, policy injunctions, deportation judgments, and U.S. legal immigration developments.' },

  // GUIDES
  { slug: 'guides', title: 'Immigration Guides | USCIS, Visa & Green Card Resources', desc: 'Browse detailed immigration guides covering USCIS processes, visas, green cards, work permits, citizenship applications, travel rules, and U.S. immigration procedures.' },
  { slug: 'how-to', title: 'Immigration How-To Guides | USCIS, Visa & Green Card Help', desc: 'Explore step-by-step immigration how-to guides for USCIS forms, visa applications, green cards, work permits, citizenship, travel rules, and immigration processes.' },
  { slug: 'visa-interview-tips', title: 'Visa Interview & Appointment Tips | U.S. Visa Guidance', desc: 'Get helpful visa interview tips, appointment updates, document guidance, consular interview preparation, approval advice, and U.S. visa application recommendations.' },
  { slug: 'application-process', title: 'Immigration Application Process | USCIS Filing & Visa Steps', desc: 'Learn about the U.S. immigration application process, including USCIS filing steps, visa applications, green card procedures, interview stages, approvals, and required documentation.' },
  { slug: 'required-documents', title: 'Immigration Required Documents | USCIS Forms & Application Checklists', desc: 'Find required immigration documents for visas, green cards, citizenship, work permits, USCIS forms, identity verification, financial proof, and application filing checklists.' },
  { slug: 'processing-times-guide', title: 'USCIS Processing Time Updates | Case Delays & Approval Trends', desc: 'Track the latest USCIS processing times, immigration case delays, approval timelines, green card and visa processing updates, and changes affecting U.S. immigration applications.' },
  { slug: 'faqs', title: 'Immigration FAQs | USCIS, Visa & Green Card Help', desc: 'Find answers to common immigration FAQs, including USCIS processes, visa rules, green card applications, work permits, citizenship, travel, and U.S. immigration procedures.' },

  // POLICY WATCH
  { slug: 'policy-watch', title: 'Policy Watch | U.S. Immigration Rules & Federal Updates', desc: 'Stay informed with the latest immigration policy watch updates, USCIS rule changes, visa regulations, border policies, federal actions, and government immigration developments.' },
  { slug: 'white-house', title: 'White House Immigration Updates | Visa, Border & Policy News', desc: 'Follow the latest White House immigration updates, presidential actions, visa policy changes, border measures, executive decisions, and federal immigration announcements.' },
  { slug: 'dhs-policies', title: 'DHS Policy Updates | Homeland Security & Immigration Rules', desc: 'Get the latest DHS policy updates, Homeland Security immigration rules, border enforcement changes, visa regulations, migrant policies, and federal immigration announcements.' },
  { slug: 'executive-orders', title: 'Immigration Executive Orders | White House Policy & Visa Updates', desc: 'Track the latest immigration executive orders, White House policy changes, visa rule updates, border actions, federal directives, and U.S. immigration announcements.' },
  { slug: 'federal-courts', title: 'Federal Court Immigration Updates | Lawsuits, Rulings & Policy Cases', desc: 'Follow the latest federal court immigration updates, legal challenges, court rulings, policy injunctions, deportation cases, and major U.S. immigration lawsuits.' },
  { slug: 'congress-bills', title: 'Congress Bills Tracker | Immigration Bills & Legislative Updates', desc: 'Track the latest Congress bills, immigration legislation, bills passed today, Senate and House updates, policy proposals, and federal immigration law changes with live bill tracking updates.' },
  { slug: 'travel-bans', title: 'Travel Ban News & Updates | U.S. Entry Restrictions & Visa Rules', desc: 'Get the latest travel ban news, U.S. entry restriction updates, visa policy changes, country-specific bans, border travel rules, and immigration announcements affecting travelers.' },
];

async function updateCategories() {
  let successCount = 0;
  let failCount = 0;
  
  for (const update of updates) {
    const { data, error } = await supabase
      .from('categories')
      .update({
        seo_title: update.title,
        seo_description: update.desc
      })
      .eq('slug', update.slug);
      
    if (error) {
      console.error(`Failed to update ${update.slug}:`, error);
      failCount++;
    } else {
      successCount++;
      console.log(`Updated ${update.slug}`);
    }
  }
  
  console.log(`\nFinished: ${successCount} successful, ${failCount} failed.`);
}

updateCategories();

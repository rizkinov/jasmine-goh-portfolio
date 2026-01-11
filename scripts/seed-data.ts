/**
 * Seed Script for Jasmine Goh Portfolio
 * 
 * This script populates the Supabase database with initial data.
 * 
 * Usage:
 * 1. Create .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * 2. Run: npx tsx scripts/seed-data.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Please set:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =============================================
// Seed Data
// =============================================

const profileData = {
  name: "Jasmine Goh",
  headline: "A UX/Product Designer and a critical thinker who focuses on creating digital experiences.",
  bio: "I'm Jasmine, a UX/Product Designer based in Kuala Lumpur, Malaysia. I specialise in bridging the tenets of design thinking, research based data, and user needs to create impactful design solutions.",
  experience: [
    { company: "RHB Banking Group", date: "Aug 2021 - Present" },
    { company: "Axiata Digital (Boost Credit)", date: "Sep 2019 - Sep 2021" },
    { company: "PETRONAS Dagangan Berhad", date: "Apr 2019 - Sep 2019" }
  ]
};

const projectsData = [
  {
    title: "Digital Acquisition Journey Optimisation",
    slug: "digital-acquisition-journey",
    client: "RHB Banking Group",
    role: "UX Research, UI Design",
    short_description: "We set out on a full-scale discovery process to explore how we can optimise lead generation and digital acquisition in the RHB website.",
    tags: ["UX Research", "UI Visualisation", "Fintech"],
    cover_image_url: null,
    content_html: `
      <h2>Overview</h2>
      <p>We set out on a full-scale discovery process to explore how we can optimise lead generation and digital acquisition in the RHB website. This project involved extensive user research, competitive analysis, and iterative design processes to create a seamless digital experience for potential customers.</p>
      
      <h3>The Challenge</h3>
      <p>RHB Banking Group needed to improve their digital acquisition funnel to better compete in the increasingly digital-first banking landscape. The existing website had high drop-off rates during the application process, and users reported confusion about product offerings.</p>
      
      <h3>The Process</h3>
      <p>Given the large scale of this discovery phase, I worked closely with 2 other talented fellow UX designers and 2 amazing Business Analysts. We employed a mixed-methods research approach including:</p>
      <ul>
        <li>User interviews with both existing and potential customers</li>
        <li>Competitive analysis of digital banking experiences</li>
        <li>Heuristic evaluation of the current website</li>
        <li>Journey mapping to identify pain points</li>
      </ul>
      
      <h3>Key Insights</h3>
      <p>Our research revealed several critical insights about user behavior and expectations:</p>
      <ol>
        <li>Users wanted clearer product comparisons before making decisions</li>
        <li>The application process had too many unnecessary steps</li>
        <li>Mobile experience needed significant improvement</li>
      </ol>
      
      <h3>The Solution</h3>
      <p>We redesigned the entire acquisition journey with a focus on:</p>
      <ul>
        <li>Streamlined navigation with clear product categorization</li>
        <li>Interactive product comparison tools</li>
        <li>Reduced form fields with smart defaults</li>
        <li>Mobile-first responsive design</li>
      </ul>
      
      <h3>Impact</h3>
      <p>The new design resulted in a 35% increase in application completion rates and a 50% reduction in user-reported confusion during the onboarding process.</p>
    `
  },
  {
    title: "CarProtect Insurance Digital Journey",
    slug: "carprotect-insurance",
    client: "Aspirasi Axiata x Great Eastern",
    role: "Product Design, UX Research",
    short_description: "Aspirasi Axiata (now known as Boost Credit), the fintech arm of Axiata Group partnered up with Great Eastern to provide digital insurance offerings.",
    tags: ["Insurtech", "Product Design", "Mobile App"],
    cover_image_url: null,
    content_html: `
      <h2>Overview</h2>
      <p>Aspirasi Axiata (now known as Boost Credit), the fintech arm of Axiata Group, partnered with Great Eastern to launch their motor insurance product with a fully digital journey - CarProtect. This project aimed to revolutionize how users purchase and manage their car insurance.</p>
      
      <h3>The Challenge</h3>
      <p>Traditional car insurance purchasing involves lengthy paperwork, multiple touchpoints, and often confusing policy terms. Our goal was to create a seamless, fully digital experience that would make buying car insurance as easy as any other e-commerce transaction.</p>
      
      <h3>Competitive Analysis</h3>
      <p>CarProtect was a more comprehensive purchasing insurance journey; which was quite a step up from the other digital insurance products in the market. We analyzed:</p>
      <ul>
        <li>Existing digital insurance platforms in Southeast Asia</li>
        <li>International best practices in insurtech</li>
        <li>User expectations from e-commerce experiences</li>
      </ul>
      
      <h3>Design Process</h3>
      <p>The design process involved several key phases:</p>
      <ol>
        <li><strong>Discovery:</strong> Understanding user pain points through interviews and surveys</li>
        <li><strong>Ideation:</strong> Collaborative workshops to generate solution concepts</li>
        <li><strong>Prototyping:</strong> Rapid prototyping and iteration based on feedback</li>
        <li><strong>Validation:</strong> Usability testing with target users</li>
      </ol>
      
      <h3>Key Features</h3>
      <ul>
        <li>One-tap vehicle information retrieval using license plate</li>
        <li>Instant quote generation with transparent pricing</li>
        <li>Digital document upload and verification</li>
        <li>In-app claims filing and tracking</li>
      </ul>
      
      <h3>Outcome</h3>
      <p>CarProtect successfully launched with strong user adoption, achieving over 10,000 policies sold within the first quarter. The app received a 4.5-star rating on both App Store and Google Play.</p>
    `
  },
  {
    title: "Virtual Banking Experience for Children",
    slug: "virtual-banking-children",
    client: "Case Study",
    role: "Product Design, UI Visualisation",
    short_description: "This case study touches upon how can we create a digital banking experience for children as young as 6 years old.",
    tags: ["Case Study", "EdTech", "Finance"],
    cover_image_url: null,
    content_html: `
      <h2>Overview</h2>
      <p>This comprehensive case study explores how we can create an engaging and educational digital banking experience for children as young as 6 years old. The study takes into account the age range of the primary target users (children) with guided access from the secondary target users (parents).</p>
      
      <h3>Research Foundation</h3>
      <p>Money habits in children are formed by the age of 7. This critical insight drove our approach to creating early financial literacy tools that are both educational and engaging.</p>
      
      <h3>Target Users</h3>
      <ul>
        <li><strong>Primary:</strong> Children aged 6-12 years old</li>
        <li><strong>Secondary:</strong> Parents or guardians who oversee accounts</li>
      </ul>
      
      <h3>Key Research Insights</h3>
      <ol>
        <li>Children learn best through gamification and visual rewards</li>
        <li>Parents want oversight and control over spending limits</li>
        <li>Simple, colorful interfaces work best for younger audiences</li>
        <li>Goal-setting features help teach delayed gratification</li>
      </ol>
      
      <h3>Design Principles</h3>
      <p>The design was guided by several core principles:</p>
      <ul>
        <li><strong>Simplicity:</strong> Large buttons, minimal text, intuitive navigation</li>
        <li><strong>Engagement:</strong> Gamified elements like badges, levels, and rewards</li>
        <li><strong>Education:</strong> Built-in lessons about saving and spending</li>
        <li><strong>Safety:</strong> Parental controls and spending limits</li>
      </ul>
      
      <h3>Core Features</h3>
      <ul>
        <li><strong>Savings Goals:</strong> Visual goal trackers with progress animations</li>
        <li><strong>Allowance Management:</strong> Automated allowance deposits from parents</li>
        <li><strong>Spending Tracker:</strong> Simple categorization with fun icons</li>
        <li><strong>Learning Hub:</strong> Interactive lessons about money management</li>
        <li><strong>Rewards System:</strong> Achievement badges for good financial habits</li>
      </ul>
      
      <h3>Parental Dashboard</h3>
      <p>A companion app for parents includes:</p>
      <ul>
        <li>Real-time spending notifications</li>
        <li>Spending limit controls</li>
        <li>Allowance scheduling</li>
        <li>Financial activity reports</li>
      </ul>
      
      <h3>Visual Design</h3>
      <p>The interface uses a vibrant color palette with friendly illustrations to create an inviting experience that doesn't feel like a traditional banking app. Character mascots guide children through different features and celebrate their achievements.</p>
      
      <h3>Conclusion</h3>
      <p>This case study demonstrates how thoughtful design can make complex financial concepts accessible to young minds while maintaining the security and oversight that parents require.</p>
    `
  }
];

// =============================================
// Seed Functions
// =============================================

async function seedProfile() {
  console.log('🌱 Seeding profile...');

  // First, delete existing profile
  await supabase.from('profile').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { data, error } = await supabase
    .from('profile')
    .insert(profileData)
    .select()
    .single();

  if (error) {
    console.error('❌ Error seeding profile:', error);
    return null;
  }

  console.log('✅ Profile seeded successfully:', data.name);
  return data;
}

async function seedProjects() {
  console.log('🌱 Seeding projects...');

  // First, delete existing projects
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { data, error } = await supabase
    .from('projects')
    .insert(projectsData)
    .select();

  if (error) {
    console.error('❌ Error seeding projects:', error);
    return null;
  }

  console.log(`✅ ${data.length} projects seeded successfully:`);
  data.forEach(project => {
    console.log(`   - ${project.title} (/${project.slug})`);
  });

  return data;
}

async function main() {
  console.log('🚀 Starting seed process...\n');

  await seedProfile();
  await seedProjects();

  console.log('\n✨ Seed process completed!');
}

main().catch(console.error);

-- =============================================
-- Jasmine Goh Portfolio - Seed Data
-- Generated from legacy-data markdown files
-- =============================================

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE projects RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE profile RESTART IDENTITY CASCADE;

-- =============================================
-- Profile Data
-- =============================================
INSERT INTO profile (name, headline, bio, experience)
VALUES (
  'Jasmine Goh',
  'UX/Product Designer based in Kuala Lumpur, Malaysia',
  'I''m Jasmine, a UX/Product Designer based in Kuala Lumpur, Malaysia. I specialise in bridging the tenets of design thinking, research based data, and user needs to create impactful design solutions for people and businesses.

When I''m not designing, I enjoy gaming and not being very good at learning the drums!

Get in touch with me at jasminegoh.ailing@gmail.com. Resume is available upon request.',
  '[
    {"company": "RHB Banking Group", "period": "Aug 2021 - Present"},
    {"company": "Axiata Digital (Boost Credit)", "period": "Sep 2019 - Sep 2021"},
    {"company": "PETRONAS Dagangan Berhad", "period": "Apr 2019 - Sep 2019"},
    {"company": "Astro Broadcast Centre", "period": "Mar 2017 - Mar 2019"},
    {"company": "Orange Revolution Sdn Bhd", "period": "Mar 2015 - Feb 2017"},
    {"company": "Radio Televisyen Malaysia (RTM)", "period": "Dec 2010 - Nov 2011"}
  ]'::jsonb
)
ON CONFLICT DO NOTHING;

-- =============================================
-- Projects Data
-- =============================================

-- Project 1: Virtual Banking Experience for Children
INSERT INTO projects (slug, title, short_description, client, role, cover_image_url, tags, content_html)
VALUES (
  'virtual-banking-experience-for-children',
  'Virtual Banking Experience for Children',
  'This case study touches upon how can we create a digital banking experience for children as young as 6 years old; allowing them to start banking on their own.',
  'UI/UX Case Study',
  'Product Design, UX Research, UI Visualisation',
  'https://framerusercontent.com/images/3HwULXsTudKqqtw5BxnWAn9ph2U.jpg',
  ARRAY['UI/UX', 'Case Study', 'Banking', 'Children', 'FinTech'],
  '<h3>Overview</h3>
<p>This case study touches upon how can we create a digital banking experience for children as young as 6 years old; allowing them to start banking on their own.</p>
<p>This study takes into account the age range of the <strong>primary target users (children)</strong> with guided access from the <strong>secondary target users (parents)</strong>, and the financial as well as cultural aspects of the demographic region.</p>
<p><strong>Methods &amp; Tools:</strong> Competitive Analysis, User Research, Interaction &amp; Visual Design, Prototyping, Adobe XD</p>
<p><strong>Date:</strong> Jan 2021</p>

<h3>Research</h3>
<p>In order to build a product and experience revolving around digital technology, money and children, it''s important to first understand about our target user behaviour.</p>

<h4>Financial Literacy</h4>
<p>Many children receive a regular "income" in the form of ''pocket money'' and thereby, many children''s understanding of income is shaped by this cultural practice. Hence, there is already some form of exposure to the concept and value of money.</p>
<p>In fact, one study from the University of Cambridge found that <strong>money habits in children were formed by the age of 7</strong>.</p>

<h4>Tech Savviness</h4>
<p>Today''s young children are brought up exposed completely to technology, giving rise to the term "digital natives". Children aged 3-5 tend to spend around 4 hours per day with technology.</p>
<p>Over 50% of children aged 6-15 responded that they are able to use and know a lot about apps on smartphones or tablets.</p>

<h3>Product Analysis</h3>
<p>Analyzed competitors including Gimi (Sweden), Otyl! Jr (Netherlands), and RoosterMoney (United Kingdom) to understand the market landscape.</p>

<h3>Ideation &amp; Concept</h3>
<p>After studying the user personas and stories, analysing their pain points and goals, I came up with several ideations for features including:</p>
<ul>
<li><strong>Allowance:</strong> Virtual wallet placeholder with spending tracking</li>
<li><strong>Coinbox:</strong> Virtual piggybank for savings</li>
<li><strong>Card:</strong> Training wheels for children in card spending</li>
</ul>

<h3>Prototype</h3>
<p><a href="https://xd.adobe.com/view/08d0d5fa-489f-41e1-6566-9738dfdeb47d-7ee1/?fullscreen" target="_blank">View Prototype</a></p>'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  client = EXCLUDED.client,
  role = EXCLUDED.role,
  cover_image_url = EXCLUDED.cover_image_url,
  tags = EXCLUDED.tags,
  content_html = EXCLUDED.content_html,
  updated_at = TIMEZONE('utc', NOW());

-- Project 2: CarProtect Insurance Digital Journey
INSERT INTO projects (slug, title, short_description, client, role, cover_image_url, tags, content_html)
VALUES (
  'carprotect-insurance-digital-journey',
  'CarProtect Insurance Digital Journey',
  'Spearheaded the UI/UX as lead designer for CarProtect motor insurance product, a digital journey launched in partnership between Aspirasi Axiata and Great Eastern.',
  'Aspirasi Axiata x Great Eastern',
  'Product Design, UX Research, UI Visualisation',
  'https://framerusercontent.com/images/OgE5URyrgPFuo4WTbTIiaaDnJ4.jpg',
  ARRAY['UI/UX', 'Insurance', 'FinTech', 'Product Design'],
  '<h3>Overview</h3>
<p>Aspirasi Axiata (now known as Boost Credit), the fintech arm of Axiata Group partnered up with Great Eastern since 2020 to provide digital insurance offerings. They launched their motor insurance product with a digital journey - CarProtect, in June 2021.</p>
<p>Running on Lean, I spearheaded the UI/UX as lead designer for all things insurtech in Aspirasi Axiata.</p>
<p>For this product, I led the entirety of the design ideation; from conducting a comprehensive competitive analysis and user research, crafting wireframes, to refining them into a final prototype.</p>
<p>CarProtect was launched in June 2021. You may view the live version of the product page <a href="https://credit.myboost.co/pasar/carprotect" target="_blank">here</a>.</p>
<p><strong>Methods &amp; Tools:</strong> Competitive Analysis, User Research, Interaction &amp; Visual Design, Prototyping, Adobe XD</p>
<p><strong>Date:</strong> February 2021 - June 2021</p>

<h3>The Process</h3>
<h4>Competitive Analysis</h4>
<p>CarProtect was a more comprehensive purchasing insurance journey; which was quite a step up from the other digital insurance products I''ve worked on in Aspirasi Axiata. I did an extensive market research and competitive analysis on various motor insurance journeys to gain better insights into the process.</p>
<p>I researched 10 insurance providers as well as 3 insurance aggregators, studying:</p>
<ul>
<li>The number of text fields and information needed before a quotation could be generated</li>
<li>Whether providers and aggregators are full straight-through processing (STP)</li>
<li>The method of notifying user once quotation is ready (non-STP)</li>
<li>The turn around time for quotation generation (non-STP)</li>
</ul>

<h4>User Research</h4>
<p>The user research and testing helped us to identify gaps and areas that needed iteration, providing us with a better insight on user needs and pain points.</p>

<h3>Prototype</h3>
<p><a href="https://xd.adobe.com/view/e611e996-8ba6-41d5-4052-19a88cc8d096-9020/?fullscreen&hints=off" target="_blank">View Prototype</a></p>'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  client = EXCLUDED.client,
  role = EXCLUDED.role,
  cover_image_url = EXCLUDED.cover_image_url,
  tags = EXCLUDED.tags,
  content_html = EXCLUDED.content_html,
  updated_at = TIMEZONE('utc', NOW());

-- Project 3: The Millennial Digital Banking Experience
INSERT INTO projects (slug, title, short_description, client, role, cover_image_url, tags, content_html)
VALUES (
  'the-millennial-digital-banking-experience',
  'The Millennial Digital Banking Experience',
  'A case study on reimagining Maybank2U''s digital consumer banking experience for Millennials with the rise of digital financial services and growing interest in virtual banks and FinTechs.',
  'UI/UX Case Study',
  'UI/UX Design, Research',
  'https://framerusercontent.com/images/3bWLSJoKSe9Ke1UnWJTtNebFHhk.jpg',
  ARRAY['UI/UX', 'Case Study', 'Banking', 'FinTech', 'Millennials'],
  '<h3>Subject Study: Maybank2U</h3>
<p>Maybank''s M2U app is by far one of Malaysia''s leading and forward-moving banking app among traditional banks. With features like QRpay and recently last year, a new e-wallet MAE as an addition, it is definitely one of the more go-to apps for Millennials when it comes to digital banking.</p>
<p>This case study touches upon how can we reimagine Maybank2U''s digital consumer banking experience for Millennials with the rise of digital financial services and growing interest in virtual banks and FinTechs.</p>
<p><em>Note: This case study was done in July 2020 (before the new launch of MAE e-wallet as a separate app from Maybank2U in Oct 2020).</em></p>

<h3>Inference</h3>
<p>As smartphones are now considered a staple in most Millennials'' fundamental necessities, digital financial services apps are more driven towards creating more lifestyle-centric features to accommodate cashless transactions.</p>
<p>E-wallets are slowly becoming a norm with cashless transactions being preferable in shopping, dining, travel, gaming, etc.</p>
<p><strong>With Maybank being a bank in itself with an E-wallet feature, there is great potential in leveraging it to cater to Millennials with more lifestyle-centric features while also being the leading digital banking provider.</strong></p>

<h3>Competitor Analysis</h3>
<p>Compared the top eWallets in Malaysia including <strong>Touch ''n Go</strong>, <strong>Boost</strong> and <strong>Grab</strong>.</p>

<h3>Redesign &amp; Prototype</h3>
<p>Privacy and security are important. Users should feel at ease and comfortable when opening the app in a public space without having to worry about their sensitive information like their savings amount being exposed.</p>
<p>A Hide/Unhide function is added where users will no longer have to feel uncomfortable opening the app while queuing at a store to make payment.</p>

<h3>Prototype</h3>
<p><a href="https://xd.adobe.com/view/f206e9be-7cf6-46e1-4899-f24668b3a080-8437/?fullscreen" target="_blank">View Prototype</a></p>'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  client = EXCLUDED.client,
  role = EXCLUDED.role,
  cover_image_url = EXCLUDED.cover_image_url,
  tags = EXCLUDED.tags,
  content_html = EXCLUDED.content_html,
  updated_at = TIMEZONE('utc', NOW());

-- Project 4: Digital Acquisition Journey Optimisation
INSERT INTO projects (slug, title, short_description, client, role, cover_image_url, tags, content_html)
VALUES (
  'digital-acquisition-journey-optimisation',
  'Digital Acquisition Journey Optimisation',
  'A full-scale discovery process to explore how we can optimise lead generation and digital acquisition in the RHB website by enhancing its user experience.',
  'RHB Banking Group',
  'UX Research, UI Design',
  'https://framerusercontent.com/images/RMuVgCCrHzgkEI4dH9Md6arRPBM.png',
  ARRAY['UX Research', 'UI Design', 'Banking', 'Lead Generation', 'Optimization'],
  '<h3>Overview</h3>
<p>We set out on a full-scale discovery process to explore how we can optimise lead generation and digital acquisition in the RHB website by enhancing its user experience. Our focus was broken down into several MVPs that targeted different product and customer journeys - from discovery to conversion.</p>
<p>The goal was to identify the gaps within each journey and develop a strategic approach to address them efficiently, to validate our design solutions, and explore opportunities to streamline internal and external processes.</p>
<p><strong>Methods &amp; Tools:</strong> User Interview, Usability Testing, Affinity Mapping, HMWs, Prototyping, FigJam, Figma</p>
<p><strong>Date:</strong> January 2022 - Ongoing</p>

<h3>The Process</h3>
<p>Given the large scale of this discovery phase, I worked closely with 2 other talented fellow UX designers and 2 amazing Business Analysts. We had the opportunity to collaborate with stakeholders from different product teams since it involves various product journeys within the site.</p>
<p>The diverse collaboration was instrumental in shaping our research approach and problem-solving strategies as we incorporated insights from different angles to decide on a holistic solution that will enhance the customers'' product application journey and our internal lead management processes.</p>
<p>We applied the double diamond design thinking model to our exercise:</p>
<ul>
<li><strong>User Interview</strong> with 15 participants to gather insights on user behaviour and impressions</li>
<li><strong>Usability Testing</strong> with 6 participants to validate existing journeys and identify pain points and UX gaps</li>
<li><strong>Ideation workshop</strong> with stakeholders to work out a design solution together</li>
</ul>

<h3>Improvement</h3>
<ul>
<li>Since the implementation of some of our proposed recommendations we have seen a significant increase in CTA click-rates as the navigation architecture has been improved.</li>
<li>We introduced new entry points for users to be able to reach product pages and make an application instantly.</li>
<li>Product category consolidation has also been revamped to be more consistent with other products.</li>
</ul>'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  client = EXCLUDED.client,
  role = EXCLUDED.role,
  cover_image_url = EXCLUDED.cover_image_url,
  tags = EXCLUDED.tags,
  content_html = EXCLUDED.content_html,
  updated_at = TIMEZONE('utc', NOW());

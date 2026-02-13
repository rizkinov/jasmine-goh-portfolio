/**
 * Migration Script: Convert existing projects to structured block layouts
 *
 * Constructs well-structured PageContent (sections with multi-column layouts)
 * for each project and updates the content_blocks column in Supabase.
 *
 * Usage: npx tsx scripts/migrate-project-blocks.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ---- Helpers ----

let counter = 0;
function id() {
    return `mg${Date.now().toString(36)}-${(++counter).toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function textBlock(html: string) {
    return { id: id(), type: 'text' as const, content_html: html };
}

function imageBlock(src: string, alt: string, opts: Record<string, unknown> = {}) {
    return { id: id(), type: 'image' as const, src, alt, size: 'l', rounded: 'md', shadow: 'md', ...opts };
}

function spacerBlock(height = 32) {
    return { id: id(), type: 'spacer' as const, height };
}

function tableBlock(html: string) {
    return { id: id(), type: 'table' as const, content_html: html };
}

function col(width: number, blocks: unknown[]) {
    return { id: id(), widthPercent: width, blocks };
}

function sec(layout: string, columns: unknown[]) {
    return { id: id(), layout, columns };
}

// Shorthand for single-column section with one or more blocks
function sec100(...blocks: unknown[]) {
    return sec('100', [col(100, blocks)]);
}

// Shorthand for spacer section
function spacerSec(height = 32) {
    return sec100(spacerBlock(height));
}

// ---- Supabase image base URL ----
const IMG = 'https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads';

// =============================================
// Project 1: Virtual Banking Experience for Children
// =============================================

function buildVirtualBanking() {
    return {
        version: 1 as const,
        sections: [
            // 1. Overview
            sec100(
                textBlock(`<h2>Overview</h2>
<p>This case study touches upon how can we create a digital banking experience for children as young as 6 years old; allowing them to start banking on their own.</p>
<p>This study takes into account the age range of the primary target users (children) with guided access from the secondary target users (parents), and the financial as well as cultural aspects of the demographic region.</p>`),
            ),

            // 2. Meta: Role | Methods & Tools | Date
            sec('33-33-33', [
                col(33.33, [textBlock(`<h3>My Role</h3><p>Product Design, UX Research, UI Visualisation</p>`)]),
                col(33.33, [textBlock(`<h3>Methods &amp; Tools</h3><p>Competitive Analysis, User Research, Interaction &amp; Visual Design, Prototyping, Adobe XD</p>`)]),
                col(33.34, [textBlock(`<h3>Date</h3><p>Jan 2021</p>`)]),
            ]),

            // 3. Spacer
            spacerSec(),

            // 4. Research heading + intro
            sec100(
                textBlock(`<h2>Research</h2>
<p>In order to build a product and experience revolving around digital technology, money and children, it's important to first understand about our target user behaviour. Spending and shopping online, transferring money using apps or computers may seem almost like second nature to us adults, but one may wonder how much exactly can a child comprehend and navigate around money and technology, especially in this day and age.</p>`),
            ),

            // 5. Financial Literacy | Tech Savviness (50-50)
            sec('50-50', [
                col(50, [
                    textBlock(`<h3>Financial Literacy</h3>
<p>Many children receive a regular "income" in the form of 'pocket money' and thereby, many children's understanding of income is shaped by this cultural practice. Hence, there is already some form of exposure to the concept and value of money.</p>
<p>In fact, one study from the University of Cambridge found that</p>
<blockquote><p><strong>money habits in children were formed by the age of 7</strong></p></blockquote>
<p><em>Source: "Habit Formation and Learning in Young Children" by Dr. David Whitebread and Dr. Sue Bingham, University of Cambridge.</em></p>
<p>Children ages 8-12 exhibit new skills and thought patterns, and by the end of this developmental stage, they should achieve the milestone of logical thought, allowing them to understand the concept of cashless money transactions.</p>`),
                ]),
                col(50, [
                    textBlock(`<h3>Tech Savviness</h3>
<p>Today's young children are brought up exposed completely to technology, giving rise to the term "digital natives". Children aged 3-5 tend to spend around 4 hours per day with technology. Other age groups are showing an increase in the amount of time spent as well.</p>
<p>Statistics tell us that 45% of 8-11 year olds use social networking sites. Many parents admit to asking their children and teenagers for help with problems on their phones or tablets, and even younger children demonstrate remarkable skills with computers.</p>
<p>In research by Ofcom,</p>
<blockquote><p><strong>over 50% of children aged 6-15 responded that they are able to use and know a lot about apps on smartphones or tablets.</strong></p></blockquote>
<p><em>Source: "Tech-Savvy Toddlers: Why are Young Children So Good With Technology?", (February 2018) Southern Phone Co. Aus</em></p>`),
                ]),
            ]),

            // 6. Spacer
            spacerSec(),

            // 7. Product Analysis heading
            sec100(
                textBlock(`<h2>Product Analysis</h2>`),
            ),

            // 8. Competitive Analysis: Gimi | Otyl Jr | RoosterMoney (33-33-33)
            sec('33-33-33', [
                col(33.33, [
                    imageBlock(`${IMG}/1769239525502-d5ib7n.jpg`, 'Gimi app screenshot', { size: 'xl', rounded: 'lg', shadow: 'sm' }),
                    textBlock(`<h3>Gimi — Sweden</h3>
<p>Gimi is an educational app that teaches children and young adults about money.</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Prepaid Card is available (MasterCard)</li>
<li>Very interactive with appealing visual designs and animations</li>
<li>Gamification via quizzes and achievements on financial education</li>
<li>Chore Request/Tracker available</li>
<li>Basic interactive Chatbot</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
<li>Limited currency options</li>
<li>UI can be a little complicated for younger children</li>
<li>Link to bank account unavailable</li>
</ul>`),
                ]),
                col(33.33, [
                    imageBlock(`${IMG}/1769239546884-swtsz7.jpg`, 'Otyl Jr app screenshot', { size: 'xl', rounded: 'lg', shadow: 'sm' }),
                    textBlock(`<h3>Otyl! Jr — Netherlands</h3>
<p>Otly! is a free platform that modernizes the way families handle pocket money and teaches children the responsibilities that come with it.</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Can link to bank account (only Parent access)</li>
<li>Can purchase giftcards (only Parent access)</li>
<li>Option to donate to charity</li>
<li>Simple and clean UI, easy to navigate especially for younger children</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
<li>Very limited currency options</li>
<li>No Prepaid Card available</li>
<li>No Chore Request/Tracker</li>
<li>Child access and Parents access are in 2 separate app; Otly! Jr and Otly!</li>
</ul>`),
                ]),
                col(33.34, [
                    imageBlock(`${IMG}/1769239589465-il2cqj.jpg`, 'RoosterMoney app screenshot', { size: 'xl', rounded: 'lg', shadow: 'sm' }),
                    textBlock(`<h3>RoosterMoney — United Kingdom</h3>
<p>RoosterMoney helps families keep track of pocket money and helps teach children to save responsibly.</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Prepaid Card is available (Visa)</li>
<li>Chore Request/Tracker (with PLUS plan)</li>
<li>Nice and clean UI, easy to navigate</li>
<li>Option to donate to charity</li>
<li>Available in several different currency options including MYR</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
<li>Link to bank account unavailable</li>
<li>Spend, Save and Give pots can be a little confusing and redundant</li>
<li>Additional charges to unlock Chore Request/Tracker feature</li>
</ul>`),
                ]),
            ]),

            // 9. Spacer
            spacerSec(),

            // 10. User Research heading + intro
            sec100(
                textBlock(`<h2>User Research</h2>
<p>As this experience will be an introductory exposure to children on their first financial management learning, a lot of hand-holding from parents/guardian is to be expected. Also, as they are not adults yet, parent/guardian supervision and permission are legally required.</p>
<p>Hence, this experience is not limited to just children but also extends to those of parents and guardians as users.</p>
<h3>User Persona</h3>`),
            ),

            // 11. User Personas: Arvind | Susan (50-50)
            sec('50-50', [
                col(50, [
                    imageBlock(`${IMG}/1769239736404-uxns5y.jpg`, 'Arvind Daniel persona', { size: 'xl', rounded: 'lg', shadow: 'sm' }),
                    textBlock(`<h4>Arvind Daniel — 10 years old</h4>
<p><strong>Student (Primary 4)</strong> — Loves games and sports especially football</p>
<p><strong>Gadgets:</strong> Laptop, Budget smartphone</p>
<p><strong>Favorite Apps:</strong> YouTube, PubG Mobile, TikTok</p>
<p><strong>Pain Points:</strong></p>
<ul>
<li>Loses track of how much allowance money he's asked from his parents</li>
<li>Has to rely on his parents and constantly ask for money from them</li>
</ul>
<p><strong>Motivation:</strong></p>
<ul>
<li>Save up enough money for new football shoes</li>
<li>Top up game credits</li>
<li>Hang out with friends and buy snacks and boba tea</li>
</ul>`),
                ]),
                col(50, [
                    imageBlock(`${IMG}/1769239786532-7swu9v.jpg`, 'Susan Tanuwijaya persona', { size: 'xl', rounded: 'lg', shadow: 'sm' }),
                    textBlock(`<h4>Susan Tanuwijaya — 42 years old</h4>
<p><strong>Career Woman and Mother</strong> — Enjoys coffee and reading</p>
<p><strong>Gadgets:</strong> Laptop, Smartphone, Tablet</p>
<p><strong>Favorite Apps:</strong> Grab, Lazada, Kindle, WhatsApp</p>
<p><strong>Pain Points:</strong></p>
<ul>
<li>Her children tend to overspend and always ask her for more allowance money</li>
<li>Busy and sometimes forgets/loses track of her children's allowance</li>
</ul>
<p><strong>Motivation:</strong></p>
<ul>
<li>Teach and instill saving habits and the value of money in her children from a young age</li>
<li>Keeping track of her children's finances and allowance</li>
</ul>`),
                ]),
            ]),

            // 12. User Stories table
            sec100(
                textBlock(`<h3>User Stories</h3>`),
                tableBlock(`<table>
<thead>
<tr><th>User</th><th>Story</th><th>Acceptance Criteria</th></tr>
</thead>
<tbody>
<tr><td>Child</td><td>As a child, I want to see how much allowance I have</td><td>View balance on home screen</td></tr>
<tr><td>Child</td><td>As a child, I want to save money for things I want</td><td>Transfer money to savings/coinbox</td></tr>
<tr><td>Child</td><td>As a child, I want to spend money independently</td><td>Use prepaid card for purchases</td></tr>
<tr><td>Parent</td><td>As a parent, I want to give my child allowance regularly</td><td>Set up scheduled allowance payments</td></tr>
<tr><td>Parent</td><td>As a parent, I want to track my child's spending</td><td>View transaction history</td></tr>
<tr><td>Parent</td><td>As a parent, I want to control how much my child can spend</td><td>Set spending limits and top up prepaid card</td></tr>
</tbody>
</table>`),
            ),

            // 13. Spacer
            spacerSec(),

            // 14. Ideation heading + intro
            sec100(
                textBlock(`<h2>Ideation &amp; Concept</h2>
<p>After studying the user personas and stories, analysing their pain points and goals, I came up with several ideations for features that would address their needs. I will be highlighting 3 major features for the purpose of this case study.</p>`),
            ),

            // 15. Features: Allowance | Coinbox | Prepaid Card (33-33-33)
            sec('33-33-33', [
                col(33.33, [
                    textBlock(`<h3>Allowance</h3>
<ul>
<li>Serve as some sort of a virtual wallet placeholder</li>
<li>Child can independently set aside some fund from Allowance into Coinbox as savings</li>
<li>Keeps track of child's spending as well as savings</li>
<li>Parent user will be able to set scheduled reminder for allowance payout day</li>
<li>Parents will have access to all 3 features and can deduct/add funds</li>
<li>Parents will receive notifications whenever there is activity or transaction in app</li>
</ul>`),
                ]),
                col(33.33, [
                    textBlock(`<h3>Coinbox</h3>
<ul>
<li>Serve as a virtual piggybank/coinbox placeholder for savings</li>
<li>Child can track how much they've saved in their Coinbox</li>
<li>Child can withdraw from Coinbox should they wish to use the money with Parents' supervision</li>
<li>Parent can also directly deposit money into Child's Coinbox to boost their savings</li>
</ul>`),
                ]),
                col(33.34, [
                    textBlock(`<h3>Prepaid Card</h3>
<ul>
<li>Training wheels for children in card spending! Children can learn financial responsibility by spending using cards without the burden of debts</li>
<li>Only Parent may top up a preferred amount of credit into the linked prepaid card via online banking in app. Child's Card account will then be updated instantly</li>
<li>Parents can limit spending by depositing only a certain amount</li>
<li>Children can have some degree of independence and control of their own spending</li>
</ul>`),
                ]),
            ]),

            // 16. Spacer
            spacerSec(),

            // 17. User Flow heading
            sec100(
                textBlock(`<h2>User Flow</h2>`),
            ),

            // 18. User Flows: Child | Parent (50-50)
            sec('50-50', [
                col(50, [
                    textBlock(`<h3>Child User Flow</h3>`),
                    imageBlock(`${IMG}/1769240089458-htbzfp.png`, 'Child user flow diagram', { size: 'xl', rounded: 'md', shadow: 'sm' }),
                ]),
                col(50, [
                    textBlock(`<h3>Parent User Flow</h3>`),
                    imageBlock(`${IMG}/1769240134414-j06aqw.png`, 'Parent user flow diagram', { size: 'xl', rounded: 'md', shadow: 'sm' }),
                ]),
            ]),

            // 19. Spacer
            spacerSec(),

            // 20. Wireframe heading
            sec100(
                textBlock(`<h2>Wireframe</h2>`),
            ),

            // 21. Wireframes: Child | Parent (50-50)
            sec('50-50', [
                col(50, [
                    textBlock(`<h3>Child User Wireframe</h3>`),
                    imageBlock(`${IMG}/1769240183714-hqi8ff.jpg`, 'Child wireframe screens', { size: 'xl', rounded: 'md', shadow: 'sm' }),
                ]),
                col(50, [
                    textBlock(`<h3>Parent User Wireframe</h3>`),
                    imageBlock(`${IMG}/1769240207272-6lj3z2.jpg`, 'Parent wireframe screens', { size: 'xl', rounded: 'md', shadow: 'sm' }),
                ]),
            ]),

            // 22. Spacer
            spacerSec(),

            // 23. Hi-fidelity heading
            sec100(
                textBlock(`<h2>Hi-fidelity</h2>`),
            ),

            // 24. Hi-fi images (50-50)
            sec('50-50', [
                col(50, [
                    imageBlock(`${IMG}/1769240502957-vskw06.jpg`, 'High fidelity mockups - screens 1', { size: 'xl', rounded: 'md', shadow: 'md' }),
                ]),
                col(50, [
                    imageBlock(`${IMG}/1769240527037-trt9iu.jpg`, 'High fidelity mockups - screens 2', { size: 'xl', rounded: 'md', shadow: 'md' }),
                ]),
            ]),

            // 25. Spacer
            spacerSec(),

            // 26. Prototype
            sec100(
                textBlock(`<h2>Prototype</h2>
<p><a href="#" class="text-primary underline underline-offset-4 hover:text-primary/80">View Prototype</a></p>`),
            ),

            // 27. Appendix
            sec100(
                textBlock(`<h2>Appendix</h2>
<ul>
<li><a href="https://mascdn.azureedge.net/cms/the-money-advice-service-habit-formation-and-learning-in-young-children-may2013.pdf" class="text-primary underline underline-offset-4 hover:text-primary/80">"Habit Formation and Learning in Young Children" - May 2013, Dr. David Whitebread and Dr. Sue Bingham, University of Cambridge</a></li>
<li><a href="https://www.legendsbank.com/news/financial-education-children/" class="text-primary underline underline-offset-4 hover:text-primary/80">"Educating Your Children on Finances" - Legends Banks, US</a></li>
<li><a href="https://www.southernphone.com.au/Blog/2018/Feb/tech-savvy-toddlers-kids-good-with-technology" class="text-primary underline underline-offset-4 hover:text-primary/80">"Tech-Savvy Toddlers: Why are Young Children So Good With Technology?" - February 2018, Southern Phone Co. Australia</a></li>
<li><a href="https://pediatrics.aappublications.org/content/early/2015/10/28/peds.2015-2151" class="text-primary underline underline-offset-4 hover:text-primary/80">"Exposure and Use of Mobile Media Devices by Young Children" - September 2015, Pediatrics</a></li>
<li><a href="https://www.prnewswire.com/news-releases/kids-will-be-more-tech-savvy-than-their-parents-by-the-time-they-are-10-years-old-301154064.html" class="text-primary underline underline-offset-4 hover:text-primary/80">"Kids Will Be More Tech-Savvy Than Their Parents by the Time They Are 10 Years Old" - October 2020, VTech</a></li>
</ul>`),
            ),
        ],
    };
}

// =============================================
// Project 2: CarProtect Insurance Digital Journey
// =============================================

function buildCarProtect() {
    return {
        version: 1 as const,
        sections: [
            // 1. Overview
            sec100(
                textBlock(`<h3>Overview</h3>
<p>Aspirasi Axiata (now known as Boost Credit), the fintech arm of Axiata Group partnered up with Great Eastern since 2020 to provide digital insurance offerings. They launched their motor insurance product with a digital journey - CarProtect, in June 2021.</p>
<p>Running on Lean, I spearheaded the UI/UX as lead designer for all things insurtech in Aspirasi Axiata.</p>
<p>For this product, I led the entirety of the design ideation; from conducting a comprehensive competitive analysis and user research, crafting wireframes, to refining them into a final prototype.</p>
<p>CarProtect was launched in June 2021. You may view the live version of the product page <a href="https://credit.myboost.co/pasar/carprotect" target="_blank">here</a>.</p>`),
            ),

            // 2. Meta: Role | Methods & Tools | Date
            sec('33-33-33', [
                col(33.33, [textBlock(`<h3>Role</h3><p>Product Design, UX Research, UI Visualisation</p>`)]),
                col(33.33, [textBlock(`<h3>Methods &amp; Tools</h3><p>Competitive Analysis, User Research, Interaction &amp; Visual Design, Prototyping, Adobe XD</p>`)]),
                col(33.34, [textBlock(`<h3>Date</h3><p>February 2021 - June 2021</p>`)]),
            ]),

            // 3. Spacer
            spacerSec(),

            // 4. The Process heading
            sec100(
                textBlock(`<h3>The Process</h3>`),
            ),

            // 5. Competitive Analysis
            sec100(
                textBlock(`<h4>Competitive Analysis</h4>
<p>CarProtect was a more comprehensive purchasing insurance journey; which was quite a step up from the other digital insurance products I've worked on in Aspirasi Axiata. I did an extensive market research and competitive analysis on various motor insurance journeys to gain better insights into the process.</p>
<p>I researched 10 insurance providers as well as 3 insurance aggregators, studying:</p>
<ul>
<li>The number of text fields and information needed before a quotation could be generated</li>
<li>Whether providers and aggregators are full straight-through processing (STP)</li>
<li>The method of notifying user once quotation is ready (non-STP)</li>
<li>The turn around time for quotation generation (non-STP)</li>
</ul>`),
            ),

            // 6. User Research
            sec100(
                textBlock(`<h4>User Research</h4>
<p>The user research and testing helped us to identify gaps and areas that needed iteration, providing us with a better insight on user needs and pain points.</p>`),
            ),

            // 7. Spacer
            spacerSec(),

            // 8. Prototype
            sec100(
                textBlock(`<h3>Prototype</h3>
<p><a href="https://xd.adobe.com/view/e611e996-8ba6-41d5-4052-19a88cc8d096-9020/?fullscreen&amp;hints=off" target="_blank">View Prototype</a></p>`),
            ),
        ],
    };
}

// =============================================
// Project 3: The Millennial Digital Banking Experience
// =============================================

function buildMillennialBanking() {
    return {
        version: 1 as const,
        sections: [
            // 1. Subject Study
            sec100(
                textBlock(`<h3>Subject Study: Maybank2U</h3>
<p>Maybank's M2U app is by far one of Malaysia's leading and forward-moving banking app among traditional banks. With features like QRpay and recently last year, a new e-wallet MAE as an addition, it is definitely one of the more go-to apps for Millennials when it comes to digital banking.</p>
<p>This case study touches upon how can we reimagine Maybank2U's digital consumer banking experience for Millennials with the rise of digital financial services and growing interest in virtual banks and FinTechs.</p>
<p><em>Note: This case study was done in July 2020 (before the new launch of MAE e-wallet as a separate app from Maybank2U in Oct 2020).</em></p>`),
            ),

            // 2. Spacer
            spacerSec(),

            // 3. Inference
            sec100(
                textBlock(`<h3>Inference</h3>
<p>As smartphones are now considered a staple in most Millennials' fundamental necessities, digital financial services apps are more driven towards creating more lifestyle-centric features to accommodate cashless transactions.</p>
<p>E-wallets are slowly becoming a norm with cashless transactions being preferable in shopping, dining, travel, gaming, etc.</p>
<p><strong>With Maybank being a bank in itself with an E-wallet feature, there is great potential in leveraging it to cater to Millennials with more lifestyle-centric features while also being the leading digital banking provider.</strong></p>`),
            ),

            // 4. Spacer
            spacerSec(),

            // 5. Competitor Analysis
            sec100(
                textBlock(`<h3>Competitor Analysis</h3>
<p>Compared the top eWallets in Malaysia including <strong>Touch 'n Go</strong>, <strong>Boost</strong> and <strong>Grab</strong>.</p>`),
            ),

            // 6. Spacer
            spacerSec(),

            // 7. Redesign & Prototype
            sec100(
                textBlock(`<h3>Redesign &amp; Prototype</h3>
<p>Privacy and security are important. Users should feel at ease and comfortable when opening the app in a public space without having to worry about their sensitive information like their savings amount being exposed.</p>
<p>A Hide/Unhide function is added where users will no longer have to feel uncomfortable opening the app while queuing at a store to make payment.</p>`),
            ),

            // 8. Spacer
            spacerSec(),

            // 9. Prototype
            sec100(
                textBlock(`<h3>Prototype</h3>
<p><a href="https://xd.adobe.com/view/f206e9be-7cf6-46e1-4899-f24668b3a080-8437/?fullscreen" target="_blank">View Prototype</a></p>`),
            ),
        ],
    };
}

// =============================================
// Project 4: Digital Acquisition Journey Optimisation
// =============================================

function buildDigitalAcquisition() {
    return {
        version: 1 as const,
        sections: [
            // 1. Overview
            sec100(
                textBlock(`<h3>Overview</h3>
<p>We set out on a full-scale discovery process to explore how we can optimise lead generation and digital acquisition in the RHB website by enhancing its user experience. Our focus was broken down into several MVPs that targeted different product and customer journeys - from discovery to conversion.</p>
<p>The goal was to identify the gaps within each journey and develop a strategic approach to address them efficiently, to validate our design solutions, and explore opportunities to streamline internal and external processes.</p>`),
            ),

            // 2. Meta: Role | Methods & Tools | Date
            sec('33-33-33', [
                col(33.33, [textBlock(`<h3>Role</h3><p>UX Research, UI Design</p>`)]),
                col(33.33, [textBlock(`<h3>Methods &amp; Tools</h3><p>User Interview, Usability Testing, Affinity Mapping, HMWs, Prototyping, FigJam, Figma</p>`)]),
                col(33.34, [textBlock(`<h3>Date</h3><p>January 2022 - Ongoing</p>`)]),
            ]),

            // 3. Spacer
            spacerSec(),

            // 4. The Process
            sec100(
                textBlock(`<h3>The Process</h3>
<p>Given the large scale of this discovery phase, I worked closely with 2 other talented fellow UX designers and 2 amazing Business Analysts. We had the opportunity to collaborate with stakeholders from different product teams since it involves various product journeys within the site.</p>
<p>The diverse collaboration was instrumental in shaping our research approach and problem-solving strategies as we incorporated insights from different angles to decide on a holistic solution that will enhance the customers' product application journey and our internal lead management processes.</p>
<p>We applied the double diamond design thinking model to our exercise:</p>
<ul>
<li><strong>User Interview</strong> with 15 participants to gather insights on user behaviour and impressions</li>
<li><strong>Usability Testing</strong> with 6 participants to validate existing journeys and identify pain points and UX gaps</li>
<li><strong>Ideation workshop</strong> with stakeholders to work out a design solution together</li>
</ul>`),
            ),

            // 5. Spacer
            spacerSec(),

            // 6. Improvement
            sec100(
                textBlock(`<h3>Improvement</h3>
<ul>
<li>Since the implementation of some of our proposed recommendations we have seen a significant increase in CTA click-rates as the navigation architecture has been improved.</li>
<li>We introduced new entry points for users to be able to reach product pages and make an application instantly.</li>
<li>Product category consolidation has also been revamped to be more consistent with other products.</li>
</ul>`),
            ),
        ],
    };
}

// =============================================
// Main: Update Supabase
// =============================================

async function main() {
    const projects = [
        { slug: 'virtual-banking-experience-for-children', content: buildVirtualBanking() },
        { slug: 'carprotect-insurance-digital-journey', content: buildCarProtect() },
        { slug: 'the-millennial-digital-banking-experience', content: buildMillennialBanking() },
        { slug: 'digital-acquisition-journey-optimisation', content: buildDigitalAcquisition() },
    ];

    for (const { slug, content } of projects) {
        console.log(`Updating ${slug}...`);
        console.log(`  Sections: ${content.sections.length}`);

        const { error } = await supabase
            .from('projects')
            .update({ content_blocks: content })
            .eq('slug', slug);

        if (error) {
            console.error(`  ERROR: ${error.message}`);
        } else {
            console.log(`  OK`);
        }
    }

    console.log('\nDone! All projects updated.');
}

main().catch(console.error);

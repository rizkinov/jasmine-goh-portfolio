-- Update Virtual Banking Experience for Children project
-- Run this in Supabase SQL Editor

-- First delete existing record, then insert fresh
DELETE FROM projects WHERE slug = 'virtual-banking-experience-for-children';

INSERT INTO projects (
  slug,
  title,
  short_description,
  client,
  role,
  cover_image_url,
  content_html,
  tags
) VALUES (
  'virtual-banking-experience-for-children',
  'Virtual Banking Experience for Children',
  'A digital banking experience for children as young as 6 years old, allowing them to start banking on their own with guided access from parents.',
  'Concept Project',
  'Product Design, UX Research, UI Visualisation',
  'https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads/1769239460705-aew8ll.jpg',
  '<h2>Overview</h2>
<p>This case study touches upon how can we create a digital banking experience for children as young as 6 years old; allowing them to start banking on their own.</p>
<p>This study takes into account the age range of the primary target users (children) with guided access from the secondary target users (parents), and the financial as well as cultural aspects of the demographic region.</p>

<h3>My Role</h3>
<p>Product Design, UX Research, UI Visualisation</p>

<h3>Methods &amp; Tools</h3>
<p>Competitive Analysis, User Research, Interaction &amp; Visual Design, Prototyping, Adobe XD</p>

<h3>Date</h3>
<p>Jan 2021</p>

<hr>

<h2>Research</h2>
<p>In order to build a product and experience revolving around digital technology, money and children, it''s important to first understand about our target user behaviour. Spending and shopping online, transferring money using apps or computers may seem almost like second nature to us adults, but one may wonder how much exactly can a child comprehend and navigate around money and technology, especially in this day and age.</p>

<h3>Financial Literacy</h3>
<p>Many children receive a regular "income" in the form of ''pocket money'' and thereby, many children''s understanding of income is shaped by this cultural practice. Hence, there is already some form of exposure to the concept and value of money.</p>
<p>In fact, one study from the University of Cambridge found that</p>
<blockquote><p><strong>money habits in children were formed by the age of 7</strong></p></blockquote>
<p><em>Source: "Habit Formation and Learning in Young Children" by Dr. David Whitebread and Dr. Sue Bingham, University of Cambridge.</em></p>
<p>Children ages 8-12 exhibit new skills and thought patterns, and by the end of this developmental stage, they should achieve the milestone of logical thought, allowing them to understand the concept of cashless money transactions.</p>

<h3>Tech Savviness</h3>
<p>Today''s young children are brought up exposed completely to technology, giving rise to the term "digital natives". Children aged 3-5 tend to spend around 4 hours per day with technology. Other age groups are showing an increase in the amount of time spent as well.</p>
<p>Statistics tell us that 45% of 8-11 year olds use social networking sites. Many parents admit to asking their children and teenagers for help with problems on their phones or tablets, and even younger children demonstrate remarkable skills with computers.</p>
<p>In research by Ofcom,</p>
<blockquote><p><strong>over 50% of children aged 6-15 responded that they are able to use and know a lot about apps on smartphones or tablets.</strong></p></blockquote>
<p><em>Source: "Tech-Savvy Toddlers: Why are Young Children So Good With Technology?", (February 2018) Southern Phone Co. Aus</em></p>

<hr>

<h2>Product Analysis</h2>

<h3>Gimi — Sweden</h3>
<img src="https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads/1769239525502-d5ib7n.jpg" alt="Gimi app screenshot" class="rounded-xl max-w-full my-8">
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
</ul>

<h3>Otyl! Jr — Netherlands</h3>
<img src="https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads/1769239546884-swtsz7.jpg" alt="Otyl Jr app screenshot" class="rounded-xl max-w-full my-8">
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
</ul>

<h3>RoosterMoney — United Kingdom</h3>
<img src="https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads/1769239589465-il2cqj.jpg" alt="RoosterMoney app screenshot" class="rounded-xl max-w-full my-8">
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
</ul>

<hr>

<h2>User Research</h2>
<p>As this experience will be an introductory exposure to children on their first financial management learning, a lot of hand-holding from parents/guardian is to be expected. Also, as they are not adults yet, parent/guardian supervision and permission are legally required.</p>
<p>Hence, this experience is not limited to just children but also extends to those of parents and guardians as users.</p>

<h3>User Persona</h3>

<h4>Arvind Daniel — 10 years old</h4>
<img src="https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads/1769239736404-uxns5y.jpg" alt="Arvind Daniel persona" class="rounded-xl max-w-full my-8">
<p><strong>Student (Primary 4)</strong> — Loves games and sports especially football</p>
<p><strong>Gadgets:</strong> Laptop, Budget smartphone</p>
<p><strong>Favorite Apps:</strong> YouTube, PubG Mobile, TikTok</p>
<p><strong>Pain Points:</strong></p>
<ul>
<li>Loses track of how much allowance money he''s asked from his parents</li>
<li>Has to rely on his parents and constantly ask for money from them</li>
</ul>
<p><strong>Motivation:</strong></p>
<ul>
<li>Save up enough money for new football shoes</li>
<li>Top up game credits</li>
<li>Hang out with friends and buy snacks and boba tea</li>
</ul>

<h4>Susan Tanuwijaya — 42 years old</h4>
<img src="https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads/1769239786532-7swu9v.jpg" alt="Susan Tanuwijaya persona" class="rounded-xl max-w-full my-8">
<p><strong>Career Woman and Mother</strong> — Enjoys coffee and reading</p>
<p><strong>Gadgets:</strong> Laptop, Smartphone, Tablet</p>
<p><strong>Favorite Apps:</strong> Grab, Lazada, Kindle, WhatsApp</p>
<p><strong>Pain Points:</strong></p>
<ul>
<li>Her children tend to overspend and always ask her for more allowance money</li>
<li>Busy and sometimes forgets/loses track of her children''s allowance</li>
</ul>
<p><strong>Motivation:</strong></p>
<ul>
<li>Teach and instill saving habits and the value of money in her children from a young age</li>
<li>Keeping track of her children''s finances and allowance</li>
</ul>

<h3>User Stories</h3>
<table>
<thead>
<tr>
<th>User</th>
<th>Story</th>
<th>Acceptance Criteria</th>
</tr>
</thead>
<tbody>
<tr>
<td>Child</td>
<td>As a child, I want to see how much allowance I have</td>
<td>View balance on home screen</td>
</tr>
<tr>
<td>Child</td>
<td>As a child, I want to save money for things I want</td>
<td>Transfer money to savings/coinbox</td>
</tr>
<tr>
<td>Child</td>
<td>As a child, I want to spend money independently</td>
<td>Use prepaid card for purchases</td>
</tr>
<tr>
<td>Parent</td>
<td>As a parent, I want to give my child allowance regularly</td>
<td>Set up scheduled allowance payments</td>
</tr>
<tr>
<td>Parent</td>
<td>As a parent, I want to track my child''s spending</td>
<td>View transaction history</td>
</tr>
<tr>
<td>Parent</td>
<td>As a parent, I want to control how much my child can spend</td>
<td>Set spending limits and top up prepaid card</td>
</tr>
</tbody>
</table>

<hr>

<h2>Ideation &amp; Concept</h2>
<p>After studying the user personas and stories, analysing their pain points and goals, I came up with several ideations for features that would address their needs. I will be highlighting 3 major features for the purpose of this case study.</p>

<h3>Allowance</h3>
<ul>
<li>Serve as some sort of a virtual wallet placeholder</li>
<li>Child can independently set aside some fund from Allowance into Coinbox as savings</li>
<li>Keeps track of child''s spending as well as savings</li>
<li>Parent user will be able to set scheduled reminder for allowance payout day</li>
<li>Parents will have access to all 3 features and can deduct/add funds</li>
<li>Parents will receive notifications whenever there is activity or transaction in app</li>
</ul>

<h3>Coinbox</h3>
<ul>
<li>Serve as a virtual piggybank/coinbox placeholder for savings</li>
<li>Child can track how much they''ve saved in their Coinbox</li>
<li>Child can withdraw from Coinbox should they wish to use the money with Parents'' supervision</li>
<li>Parent can also directly deposit money into Child''s Coinbox to boost their savings</li>
</ul>

<h3>Prepaid Card</h3>
<ul>
<li>Training wheels for children in card spending! Children can learn financial responsibility by spending using cards without the burden of debts</li>
<li>Only Parent may top up a preferred amount of credit into the linked prepaid card via online banking in app. Child''s Card account will then be updated instantly</li>
<li>Parents can limit spending by depositing only a certain amount</li>
<li>Children can have some degree of independence and control of their own spending</li>
</ul>

<hr>

<h2>User Flow</h2>

<h3>Child User Flow</h3>
<img src="https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads/1769240089458-htbzfp.png" alt="Child user flow diagram" class="rounded-xl max-w-full my-8">

<h3>Parent User Flow</h3>
<img src="https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads/1769240134414-j06aqw.png" alt="Parent user flow diagram" class="rounded-xl max-w-full my-8">

<hr>

<h2>Wireframe</h2>

<h3>Child User Wireframe</h3>
<img src="https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads/1769240183714-hqi8ff.jpg" alt="Child wireframe screens" class="rounded-xl max-w-full my-8">

<h3>Parent User Wireframe</h3>
<img src="https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads/1769240207272-6lj3z2.jpg" alt="Parent wireframe screens" class="rounded-xl max-w-full my-8">

<hr>

<h2>Hi-fidelity</h2>
<img src="https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads/1769240502957-vskw06.jpg" alt="High fidelity mockups - screens 1" class="rounded-xl max-w-full my-8">
<img src="https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads/1769240527037-trt9iu.jpg" alt="High fidelity mockups - screens 2" class="rounded-xl max-w-full my-8">

<hr>

<h2>Prototype</h2>
<p><a href="#" class="text-primary underline underline-offset-4 hover:text-primary/80">View Prototype</a></p>

<hr>

<h2>Appendix</h2>
<ul>
<li><a href="https://mascdn.azureedge.net/cms/the-money-advice-service-habit-formation-and-learning-in-young-children-may2013.pdf" class="text-primary underline underline-offset-4 hover:text-primary/80">"Habit Formation and Learning in Young Children" - May 2013, Dr. David Whitebread and Dr. Sue Bingham, University of Cambridge</a></li>
<li><a href="https://www.legendsbank.com/news/financial-education-children/" class="text-primary underline underline-offset-4 hover:text-primary/80">"Educating Your Children on Finances" - Legends Banks, US</a></li>
<li><a href="https://www.southernphone.com.au/Blog/2018/Feb/tech-savvy-toddlers-kids-good-with-technology" class="text-primary underline underline-offset-4 hover:text-primary/80">"Tech-Savvy Toddlers: Why are Young Children So Good With Technology?" - February 2018, Southern Phone Co. Australia</a></li>
<li><a href="https://pediatrics.aappublications.org/content/early/2015/10/28/peds.2015-2151" class="text-primary underline underline-offset-4 hover:text-primary/80">"Exposure and Use of Mobile Media Devices by Young Children" - September 2015, Pediatrics</a></li>
<li><a href="https://www.prnewswire.com/news-releases/kids-will-be-more-tech-savvy-than-their-parents-by-the-time-they-are-10-years-old-301154064.html" class="text-primary underline underline-offset-4 hover:text-primary/80">"Kids Will Be More Tech-Savvy Than Their Parents by the Time They Are 10 Years Old" - October 2020, VTech</a></li>
</ul>',
  ARRAY['UX Research', 'Product Design', 'UI Design']
);

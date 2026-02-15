/**
 * Seed Script: Populate "The Millennial Digital Banking Experience" with structured content blocks
 *
 * Updates ONLY the the-millennial-digital-banking-experience project.
 * Does NOT touch other projects.
 *
 * Usage: npx tsx scripts/seed-millennial-banking.ts
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
    return `mb${Date.now().toString(36)}-${(++counter).toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
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

function col(width: number, blocks: unknown[]) {
    return { id: id(), widthPercent: width, blocks };
}

function sec(layout: string, columns: unknown[]) {
    return { id: id(), layout, columns };
}

function sec100(...blocks: unknown[]) {
    return sec('100', [col(100, blocks)]);
}

function spacerSec(height = 32) {
    return sec100(spacerBlock(height));
}

// ---- Supabase image base URL ----
const IMG = 'https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads';

function buildMillennialBanking() {
    return {
        version: 1 as const,
        sections: [
            // 1. Note + Subject Study + Maybank2U
            sec100(
                textBlock(`<p><em>Note: This case study was done in July 2020 (before the new launch of MAE e-wallet as a separate app from Maybank2U in Oct 2020).</em></p>
<h2>Subject Study</h2>
<h3>Maybank2U</h3>
<p>Maybank's M2U app is by far one of Malaysia's leading and forward-moving banking app among traditional banks. With features like QRpay and recently last year, a new e-wallet MAE as an addition, it is definitely one of the more go-to apps for Millennials when it comes to digital banking.</p>
<p>This case study touches upon how can we reimagine Maybank2U's digital consumer banking experience for Millennials with the rise of digital financial services and growing interest in virtual banks and FinTechs.</p>`),
            ),

            // 2. Maybank login page image
            sec100(
                imageBlock(`${IMG}/1769265147107-cqp6kl.avif`, 'Maybank - login page', { size: 's', rounded: 'none', shadow: 'none', width: 400, height: 779 }),
            ),

            // 3. PwC chart image + caption
            sec100(
                imageBlock(`${IMG}/1769261124605-0uq4x5.png`, 'PwC chart 2', { size: 'xl', rounded: 'md', shadow: 'md', width: 1200, height: 676 }),
                textBlock(`<p><span class="caption-text">Source: "Virtual Banking: Malaysian Customers Take Charge". (November 2019) PwC</span></p>`),
            ),

            // 4. Spacer
            spacerSec(),

            // 5. Inference
            sec100(
                textBlock(`<h2>Inference</h2>
<p>As smartphones are now considered a staple in most Millennials' fundamental necessities, digital financial services apps are more driven towards creating more lifestyle-centric features to accommodate cashless transactions. E-wallets are slowly becoming a norm with cashless transactions being preferable in shopping, dining, travel, gaming, etc.</p>
<p>With Maybank being a bank in itself with an E-wallet feature, there is great potential in leveraging it to cater to Millennials with more lifestyle-centric features while also being the leading digital banking provider.</p>`),
            ),

            // 6. PwC infographic image + caption
            sec100(
                imageBlock(`${IMG}/1769261218048-ojh76v.png`, 'PwC infographic', { size: 'xl', rounded: 'md', shadow: 'md', width: 1200, height: 442 }),
                textBlock(`<p><span class="caption-text">Image source: "Banking on the E-wallet in Malaysia". (October 2018) PwC</span></p>`),
            ),

            // 7. Spacer
            spacerSec(),

            // 8. Competitor Analysis heading
            sec100(
                textBlock(`<h2>Competitor Analysis</h2>
<h3>Head to Head: Comparing the top eWallets in Malaysia (for consumer)</h3>
<p>For this case study, I will be using Touch 'n Go, Boost and Grab as study subjects for competitor analysis.</p>`),
            ),

            // 9. PwC table image + caption
            sec100(
                imageBlock(`${IMG}/1769261267231-fusbpc.png`, 'PwC table', { size: 'm', rounded: 'none', shadow: 'none', width: 600, height: 696 }),
                textBlock(`<p><span class="caption-text">Image source: "Banking on the E-wallet in Malaysia". (October 2018) PwC</span></p>`),
            ),

            // 10. Competitors 3-column (33-33-34)
            sec('33-33-33', [
                col(33.33, [
                    textBlock(`<h3>Boost</h3>`),
                    imageBlock(`${IMG}/1769261320102-qigcmo.png`, 'Boost screenshot', { size: 'xl', rounded: 'md', shadow: 'md', width: 1072, height: 2255 }),
                    textBlock(`<h4>Pros</h4>
<ul>
<li><p>Open-loop</p></li>
<li><p>146,000+ touchpoints</p></li>
<li><p>Multiple type of selling points</p></li>
<li><p>Boost Coins, Shake Rewards</p></li>
<li><p>Gamification via Boost Mission to collect coins</p></li>
</ul>
<h4>Cons</h4>
<ul>
<li><p>Limited merchants</p></li>
<li><p>Too many sections/categories; confusing and a little cluttered</p></li>
<li><p>UI seems dull sometimes, lacking their CI colour that makes them identifiable</p></li>
</ul>`),
                ]),
                col(33.33, [
                    textBlock(`<h3>Touch 'n Go</h3>`),
                    imageBlock(`${IMG}/1769261337382-dirvgs.png`, 'Touch n Go screenshot', { size: 'xl', rounded: 'md', shadow: 'md', width: 1071, height: 2255 }),
                    textBlock(`<h4>Pros</h4>
<ul>
<li><p>Open-loop</p></li>
<li><p>150,000+ touchpoints</p></li>
<li><p>Easily pay for toll</p></li>
<li><p>Cashback e-Vouchers</p></li>
<li><p>Nice and clean UI. Not too overwhelming</p></li>
</ul>
<h4>Cons</h4>
<ul>
<li><p>Lacking in rewards feature</p></li>
<li><p>Cannot use e-wallet to top up Touch 'n Go card at petrol stations</p></li>
</ul>`),
                ]),
                col(33.34, [
                    textBlock(`<h3>Grab</h3>`),
                    imageBlock(`${IMG}/1769261362254-sz7nph.png`, 'Grab screenshot', { size: 'xl', rounded: 'md', shadow: 'md', width: 1071, height: 2255 }),
                    textBlock(`<h4>Pros</h4>
<ul>
<li><p>Open-loop</p></li>
<li><p>3000+ touchpoints</p></li>
<li><p>Highly safe and secure</p></li>
<li><p>GrabRewards Points. Can be redeemed for Promo Deals</p></li>
<li><p>UI design consistent and clean</p></li>
</ul>
<h4>Cons</h4>
<ul>
<li><p>No direct cashback</p></li>
<li><p>Can be quite buggy sometimes. Issues with GrabCall and app crashing</p></li>
</ul>`),
                ]),
            ]),

            // 11. Analysis conclusion
            sec100(
                textBlock(`<p>While Maybank2U has also already an existing platform with various lifestyle digital products, from this research we can infer that MAE as an E-wallet within M2U, has great potential to offer Millennials plenty of Lifestyle products in bite-size.</p>`),
            ),

            // 12. Spacer
            spacerSec(),

            // 13. Redesign & Prototype heading
            sec100(
                textBlock(`<h2>Redesign &amp; Prototype</h2>`),
            ),

            // 14. Screenshot 1 - Redesign overview
            sec100(
                imageBlock(`${IMG}/1769261477935-jsxpjo.png`, 'Screenshot 1', { size: 'l', rounded: 'none', shadow: 'none', width: 800, height: 843 }),
            ),

            // 15. Privacy / Hide-Unhide text
            sec100(
                textBlock(`<p>Privacy and security are important. Users should feel at ease and comfortable when opening the app in a public space without having to worry about their sensitive information like their savings amount being exposed.</p>
<p>A Hide/Unhide function is added where users will no longer have to feel uncomfortable opening the app while queuing at a store to make payment. Users may also switch to Show All to reveal all amounts in accounts.</p>`),
            ),

            // 16. Screenshot 2 - Hide/Unhide
            sec100(
                imageBlock(`${IMG}/1769261498964-cyoulj.png`, 'Screenshot 2', { size: 'xl', rounded: 'none', shadow: 'none', width: 1200, height: 601 }),
            ),

            // 17. Screenshot 3 - Features
            sec100(
                imageBlock(`${IMG}/1769261512379-q5wti3.png`, 'Screenshot 3', { size: 'xl', rounded: 'none', shadow: 'none', width: 1200, height: 1002 }),
            ),

            // 18. Clay mockup
            sec100(
                imageBlock(`${IMG}/1769261552925-ra4kfi.jpg`, 'Clay-08-maybank', { size: 'xl', rounded: 'md', shadow: 'md', width: 1200, height: 674 }),
            ),

            // 19. Maybank mockup
            sec100(
                imageBlock(`${IMG}/1769261574183-9t1mpd.jpg`, 'Maybank mockup', { size: 'xl', rounded: 'md', shadow: 'md', width: 1200, height: 750 }),
            ),

            // 20. Spacer
            spacerSec(),

            // 21. Appendix
            sec100(
                textBlock(`<h2>Appendix</h2>
<ul>
<li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.pwc.com/my/en/assets/workshops/2019/virtual-banking-malaysian-customers-take-charge-report.pdf">"Virtual Banking: Malaysian Customers Take Charge" - November 2019, PwC</a></p></li>
<li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.pwc.com/my/en/assets/blog/pwc-my-deals-strategy-banking-on-the-ewallet-in-malaysia.pdf">"Banking on the E-wallet in Malaysia" - October 2018, PwC</a></p></li>
<li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://blog.ewhallet.com/top-ewallets-in-malaysia/">"Comparing the Top eWallets in Malaysia (2020)" - 9 June 2020, Shen Lee</a></p></li>
<li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.accenture.com/ae-en/insight-banking-distribution-marketing-consumer-study">"2017 Global Distribution &amp; Marketing Consumer Study. Beyond Digital: How Can Banks Meet Customer Demands?" - 2017, Accenture</a></p></li>
<li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.accenture.com/us-en/insights/financial-services/banks-well-prepared-digital-innovation">"Retail Banks are Prepared for Digital Innovation" - January 2019, Accenture</a></p></li>
<li><p>"Why Fintech Is Disrupting Traditional Banking" Podcast - November 2019, Wharton University of Pennsylvania</p></li>
</ul>`),
            ),
        ],
    };
}

// ---- Main ----

async function main() {
    const slug = 'the-millennial-digital-banking-experience';

    console.log(`Seeding content_blocks for: ${slug}`);

    const content = buildMillennialBanking();

    const { data, error } = await supabase
        .from('projects')
        .update({ content_blocks: content })
        .eq('slug', slug)
        .select('id, slug, title')
        .single();

    if (error) {
        console.error('Error updating project:', error.message);
        process.exit(1);
    }

    if (!data) {
        console.error(`Project with slug "${slug}" not found`);
        process.exit(1);
    }

    console.log(`Successfully seeded: "${data.title}" (${data.id})`);
    console.log(`  ${content.sections.length} sections`);
    console.log(`  12 images, 0 tables`);
}

main();

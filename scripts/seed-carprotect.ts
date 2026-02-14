/**
 * Seed Script: Populate CarProtect project with structured content blocks
 *
 * Updates ONLY the carprotect-insurance-digital-journey project.
 * Does NOT touch other projects.
 *
 * Usage: npx tsx scripts/seed-carprotect.ts
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
    return `cp${Date.now().toString(36)}-${(++counter).toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
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

function sec100(...blocks: unknown[]) {
    return sec('100', [col(100, blocks)]);
}

function spacerSec(height = 32) {
    return sec100(spacerBlock(height));
}

// ---- Supabase image base URL ----
const IMG = 'https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads';

function buildCarProtect() {
    return {
        version: 1 as const,
        sections: [
            // 1. Overview
            sec100(
                textBlock(`<h2>Overview</h2>
<p>Aspirasi Axiata (now known as Boost Credit), the fintech arm of Axiata Group partnered up with Great Eastern since 2020 to provide digital insurance offerings. They launched their motor insurance product with a digital journey - CarProtect, in June 2021. Running on Lean, I spearheaded the UI/UX as lead designer for all things insurtech in Aspirasi Axiata.</p>
<p>For this product,&nbsp;I led the entirety of the design ideation; from conducting a comprehensive competitive analysis and user research, crafting wireframes, to refining them into a final prototype. CarProtect was launched in June 2021. You may view the live version of the product page <a target="_blank" rel="noopener noreferrer nofollow" href="https://credit.myboost.co/pasar/carprotect">here</a>.</p>`),
            ),

            // 2. Meta: Role | Methods & Tools | Date
            sec('33-33-33', [
                col(33.33, [textBlock(`<h3>My Role</h3><p>Product Design, UX Research, UI Visualisation</p>`)]),
                col(33.33, [textBlock(`<h3>Methods &amp; Tools</h3><p>Competitive Analysis, User Research, Interaction &amp; Visual Design, Prototyping, Adobe XD</p>`)]),
                col(33.34, [textBlock(`<h3>Date</h3><p>February 2021 - June 2021</p>`)]),
            ]),

            // 3. Spacer
            spacerSec(),

            // 4. The Process heading
            sec100(
                textBlock(`<h2>The Process</h2>`),
            ),

            // 5. Competitive Analysis
            sec100(
                textBlock(`<h4>Competitive Analysis</h4>
<p>CarProtect was a more comprehensive purchasing insurance journey; which was quite a step up from the other digital insurance products I've worked on in Aspirasi Axiata. I did an extensive market research and competitive analysis on various motor insurance journeys to gain better insights into the process in line with understanding our business requirements and insurance regulations. I delved deep into understanding how customers navigate the purchasing process, from obtaining quotes to comparing add-on coverage options and eventually completing the purchase journey.</p>
<p>I needed to study the different competitors in the market and the extent of basic user information that was required before a price quotation could be generated. I researched 10 insurance providers as well as 3 insurance aggregators. I studied:</p>
<ul>
<li><p>the number of text fields and information needed before a quotation could be generated</p></li>
<li><p>that some providers and aggregators are not full straight-through processing (STP)</p></li>
<li><p>the method of notifying user once quotation is ready (non-STP)</p></li>
<li><p>the turn around time for quotation generation (non-STP)</p></li>
</ul>`),
            ),

            // 6. Competitive Analysis image
            sec100(
                imageBlock(`${IMG}/1769271124887-266r3i.avif`, 'Competitive analysis chart', { size: 'xl', rounded: 'none', shadow: 'none', width: 1200, height: 610 }),
            ),

            // 7. Tables: Manual Process | Digital Process (50-50)
            sec('50-50', [
                col(50, [
                    textBlock(`<h5>Manual Process Journey</h5>
<p>Total Fields Required to Request Quotation</p>`),
                    tableBlock(`<table><tbody><tr><th>AIA</th><th>CHUBB</th></tr><tr><td>7 fields</td><td>14 fields</td></tr></tbody></table>`),
                ]),
                col(50, [
                    textBlock(`<h5>Digital Process Journey (for reference)</h5>
<p>Total Fields Required to Request Quotation</p>`),
                    tableBlock(`<table><tbody><tr><th>ETIQA</th><th>AXA</th><th>MSIG</th></tr><tr><td>3 fields</td><td>6 fields</td><td>12 fields</td></tr></tbody></table>`),
                ]),
            ]),

            // 8. Analysis conclusion
            sec100(
                textBlock(`<p>I then narrowed down my analysis to 5 insurance providers and segregated them to 2 different categories based on their purchasing journey (i.e. Hybrid Manual+Digital Journey and Full Digital Journey).</p>`),
            ),

            // 9. User Research
            sec100(
                textBlock(`<h5>User Research</h5>
<p>Additionally, the user research and testing also helped us to identify gaps and areas that needed iteration, providing us with a better insight on user needs and pain points. Unfortunately, I cannot share the details of my research findings, ideation, and the full processes due to a Non-Disclosure Agreement (NDA). If you're interested to learn more about my involvement in this project, <a target="_blank" rel="noopener" href="mailto:jasminegoh.ailing@gmail.com"><u>reach out</u></a> to me and let's chat!</p>`),
            ),

            // 10. Spacer
            spacerSec(),

            // 11. Wireframe heading
            sec100(
                textBlock(`<h2>Wireframe</h2>`),
            ),

            // 12. Wireframes: Desktop | Mobile (50-50)
            sec('50-50', [
                col(50, [
                    textBlock(`<h5>Desktop Web</h5>`),
                    imageBlock(`${IMG}/1769271582201-g7bog9.avif`, 'Wireframe Desktop', { size: 'xl', rounded: 'none', shadow: 'none', width: 1200, height: 679 }),
                    textBlock(`<p><span class="caption-text">Some key wireframes for desktop web</span></p>`),
                ]),
                col(50, [
                    textBlock(`<h5>Mobile Web</h5>`),
                    imageBlock(`${IMG}/1769271645094-ra71g9.avif`, 'Wireframe Mobile', { size: 'xl', rounded: 'none', shadow: 'none', width: 1200, height: 679 }),
                    textBlock(`<p><span class="caption-text">Some key wireframes for mobile web responsive</span></p>`),
                ]),
            ]),

            // 13. Spacer
            spacerSec(),

            // 14. Mockup - Responsive (full width)
            sec100(
                imageBlock(`${IMG}/1769271702251-x0eje8.avif`, 'Mock-up Responsive', { size: 'xl', rounded: 'none', shadow: 'none', width: 1200, height: 839 }),
            ),

            // 15. Mockups: Mobile | Desktop (50-50)
            sec('50-50', [
                col(50, [
                    imageBlock(`${IMG}/1769271736539-do7gj3.avif`, 'Mock-up Mobile', { size: 'xl', rounded: 'none', shadow: 'none', width: 1200, height: 750 }),
                ]),
                col(50, [
                    imageBlock(`${IMG}/1769271768382-di77od.jpg`, 'Mock-up Desktop', { size: 'xl', rounded: 'none', shadow: 'none', width: 1200, height: 795 }),
                ]),
            ]),

            // 16. Spacer
            spacerSec(),

            // 17. Prototype
            sec100(
                textBlock(`<h2>Prototype</h2>
<p><a target="_blank" rel="noopener noreferrer nofollow" href="https://xd.adobe.com/view/e611e996-8ba6-41d5-4052-19a88cc8d096-9020/?fullscreen&amp;hints=off">View Prototype</a></p>`),
            ),
        ],
    };
}

// ---- Main ----

async function main() {
    const slug = 'carprotect-insurance-digital-journey';

    console.log(`Seeding content_blocks for: ${slug}`);

    const content = buildCarProtect();

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
    console.log(`  6 images, 2 tables`);
}

main();

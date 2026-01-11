import { getProjects, getProfile } from '@/lib/supabase';
import { HeroSection, ProjectGrid, Navbar, Footer } from '@/components/portfolio';
import type { Metadata } from 'next';

// Metadata for SEO
export const metadata: Metadata = {
    title: 'Jasmine Goh | UX/Product Designer',
    description: 'UX/Product Designer based in Kuala Lumpur, Malaysia. Specializing in bridging design thinking, research-based data, and user needs to create impactful design solutions.',
    openGraph: {
        title: 'Jasmine Goh | UX/Product Designer',
        description: 'UX/Product Designer specializing in creating impactful digital experiences.',
        type: 'website',
    },
};

export default async function HomePage() {
    // Fetch data from Supabase
    const profile = await getProfile();
    const projects = await getProjects();

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Add padding for fixed navbar */}
            <div className="pt-16">
                <HeroSection
                    name={profile?.name ?? "Jasmine Goh"}
                    headline={profile?.headline ?? "A UX/Product Designer and a critical thinker who focuses on creating digital experiences."}
                />

                <div id="work">
                    <ProjectGrid projects={projects} />
                </div>
            </div>

            <Footer />
        </main>
    );
}
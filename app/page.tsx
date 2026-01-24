import { getProjects, getProfile } from '@/lib/supabase';
import { HeroSection, ProjectGrid, Navbar, Footer } from '@/components/portfolio';
import type { Metadata } from 'next';

// Revalidate every 60 seconds to pick up database changes
export const revalidate = 60;

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

    // Profile image URL
    const profileImageUrl = 'https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads/1769245054638-7g52v8.png';

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Add padding for fixed navbar */}
            <div className="pt-16">
                <HeroSection
                    name={profile?.name ?? "Jasmine Goh"}
                    headline={profile?.headline ?? "Creating thoughtful digital experiences through user-centered design."}
                    profileImageUrl={profileImageUrl}
                />

                <div id="work">
                    <ProjectGrid projects={projects} />
                </div>
            </div>

            <Footer />
        </main>
    );
}
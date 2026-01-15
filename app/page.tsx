import { getProjects, getProfile } from '@/lib/supabase';
import { getMediaByFilename } from '@/lib/media';
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

    // Fetch profile image from media library (transparent PNG)
    const profileImage = await getMediaByFilename('jasmine-profile-transparent');

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Add padding for fixed navbar */}
            <div className="pt-16">
                <HeroSection
                    name={profile?.name ?? "Jasmine Goh"}
                    headline={profile?.headline ?? "Creating thoughtful digital experiences through user-centered design."}
                    profileImageUrl={profileImage?.public_url}
                />

                <div id="work">
                    <ProjectGrid projects={projects} />
                </div>
            </div>

            <Footer />
        </main>
    );
}
import { getProfile } from '@/lib/supabase';
import { Navbar, Footer } from '@/components/portfolio';
import { AboutContent } from './AboutContent';
import type { Metadata } from 'next';

// Revalidate every 60 seconds to pick up database changes
export const revalidate = 60;

export const metadata: Metadata = {
    title: 'About | Jasmine Goh',
    description: 'Learn more about Jasmine Goh - UX/Product Designer based in Kuala Lumpur, Malaysia.',
    openGraph: {
        title: 'About | Jasmine Goh',
        description: 'UX/Product Designer specializing in creating impactful digital experiences.',
        type: 'website',
    },
};

export default async function AboutPage() {
    const profile = await getProfile();

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-16">
                <AboutContent profile={profile} />
            </div>

            <Footer />
        </main>
    );
}

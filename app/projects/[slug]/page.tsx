import { getProjectBySlug, getProjects } from '@/lib/supabase';
import { Navbar, Footer } from '@/components/portfolio';
import { ProjectContent } from './ProjectContent';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface ProjectPageProps {
    params: Promise<{ slug: string }>;
}

// Generate static params for all projects
export async function generateStaticParams() {
    const projects = await getProjects();

    return projects.map((project) => ({
        slug: project.slug,
    }));
}

// Generate metadata for each project
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        return {
            title: 'Project Not Found | Jasmine Goh',
        };
    }

    return {
        title: `${project.title} | Jasmine Goh`,
        description: project.short_description,
        openGraph: {
            title: project.title,
            description: project.short_description,
            type: 'article',
            images: project.cover_image_url ? [project.cover_image_url] : [],
        },
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-16">
                <ProjectContent project={project} />
            </div>

            <Footer />
        </main>
    );
}

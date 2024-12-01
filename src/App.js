import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProjectCard = ({ title, description, technologies, imageUrl }) => (
  <Card className="bg-gray-900 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 overflow-hidden">
    <CardHeader>
      <CardTitle className="text-purple-400">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <img
          src={imageUrl || "/api/placeholder/400/200"}
          alt={title}
          className="w-full h-48 object-cover rounded-lg"
        />
        <p className="text-gray-300">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const BlogPost = ({ title, date, preview }) => (
  <Card className="bg-gray-900 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
    <CardHeader>
      <CardTitle className="text-purple-400">{title}</CardTitle>
      <p className="text-gray-400 text-sm">{date}</p>
    </CardHeader>
    <CardContent>
      <p className="text-gray-300">{preview}</p>
      <button className="mt-4 text-purple-400 hover:text-purple-300">Read more →</button>
    </CardContent>
  </Card>
);

const Navigation = ({ activePage, setActivePage }) => (
  <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm border-b border-purple-500/20 z-50">
    <div className="max-w-5xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400">Your Name</h1>
        <div className="space-x-6">
          {['Projects', 'About', 'Blog'].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page.toLowerCase())}
              className={`${
                activePage === page.toLowerCase()
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-purple-300'
              } transition-colors duration-200`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  </nav>
);

const Projects = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <ProjectCard
      title="Project 1"
      description="A revolutionary project that showcases the future of technology."
      technologies={['React', 'Node.js', 'TailwindCSS']}
    />
    <ProjectCard
      title="Project 2"
      description="An innovative solution to modern problems using cutting-edge tech."
      technologies={['Python', 'TensorFlow', 'AWS']}
    />
  </div>
);

const About = () => (
  <Card className="bg-gray-900 border-purple-500/20">
    <CardContent className="space-y-6 p-6">
      <div className="flex justify-center">
        <img
          src="/api/placeholder/150/150"
          alt="Profile"
          className="rounded-full w-32 h-32 border-2 border-purple-500/50"
        />
      </div>
      <h2 className="text-2xl font-bold text-purple-400 text-center">About Me</h2>
      <p className="text-gray-300">
        I'm a passionate developer with expertise in building modern web applications.
        My journey in technology started with a curiosity about how things work,
        which led me to pursue a career in software development.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-purple-400">Skills</h3>
          <ul className="list-disc list-inside text-gray-300">
            <li>Frontend Development</li>
            <li>Backend Architecture</li>
            <li>Cloud Computing</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-purple-400">Interests</h3>
          <ul className="list-disc list-inside text-gray-300">
            <li>AI & Machine Learning</li>
            <li>Open Source</li>
            <li>UI/UX Design</li>
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Blog = () => (
  <div className="space-y-6">
    <BlogPost
      title="The Future of Web Development"
      date="December 1, 2024"
      preview="Exploring the latest trends and technologies shaping the future of web development..."
    />
    <BlogPost
      title="Building Scalable Applications"
      date="November 25, 2024"
      preview="Best practices and architecture patterns for creating scalable web applications..."
    />
  </div>
);

const PersonalWebsite = () => {
  const [activePage, setActivePage] = useState('projects');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation activePage={activePage} setActivePage={setActivePage} />
      <main className="max-w-5xl mx-auto px-4 py-24">
        {activePage === 'projects' && <Projects />}
        {activePage === 'about' && <About />}
        {activePage === 'blog' && <Blog />}
      </main>
    </div>
  );
};

export default PersonalWebsite;
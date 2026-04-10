import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";
import { allProjects } from "./data";

export const metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  const [featured, ...rest] = allProjects;

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-stone-800 sm:text-4xl">
            Projects
          </h2>
          <p className="mt-4 text-stone-500">
            Some of the projects are from work and some are on my own time.
          </p>
        </div>
        <div className="w-full h-px bg-stone-300" />

        <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2">
          {/* Featured project: full height left card */}
          <Card>
            <article className="relative w-full h-full p-4 md:p-8">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-stone-700">
                  {featured.date ? (
                    <time dateTime={new Date(featured.date).toISOString()}>
                      {Intl.DateTimeFormat(undefined, {
                        dateStyle: "medium",
                      }).format(new Date(featured.date))}
                    </time>
                  ) : (
                    <span>SOON</span>
                  )}
                </div>
              </div>
              <h2 className="mt-4 text-3xl font-bold text-stone-800 group-hover:text-stone-900 sm:text-4xl font-display">
                {featured.title}
              </h2>
              <p className="mt-4 leading-8 duration-150 text-stone-500 group-hover:text-stone-700">
                {featured.description}
              </p>
              {featured.url && (
                <div className="absolute bottom-4 md:bottom-8">
                  <p className="hidden text-stone-600 hover:text-stone-900 lg:block">
                    View project <span aria-hidden="true">&rarr;</span>
                  </p>
                </div>
              )}
            </article>
          </Card>

          {/* Right column: remaining projects */}
          <div className="flex flex-col w-full gap-8 mx-auto border-t border-stone-200 lg:mx-0 lg:border-t-0">
            {rest.map((project) => (
              <Card key={project.slug}>
                <Article project={project} />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

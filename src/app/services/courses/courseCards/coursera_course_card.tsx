import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CodeIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { FaAngleDown, FaArrowRotateRight } from "react-icons/fa6";
import { z } from "zod";
import { COURSERA_COURSE_SCHEMA } from "../upload/courses.types";
import { serverResponseDataSchema } from "../schema";

export default function CourseraCourseCard({
  item,
  index,
  selectedIndex,
  setSelectedIndex,
  scrappingIndex,
  scrapeSingleCourse,
}: {
  // Forcing the item to be of type COURSERA_COURSE_SCHEMA
  item: z.infer<typeof serverResponseDataSchema> & {
    provider: "coursera";
    response: z.infer<typeof COURSERA_COURSE_SCHEMA>;
  };
  index: number;
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
  scrappingIndex: number | null;
  scrapeSingleCourse: (index: number) => void;
}) {
  if (item.provider !== "coursera") return null;

  return (
    <div key={index} className="w-full">
      {/* Card */}
      <div className="relative overflow-visible text-foreground">
        <div
          className={cn(
            "relative w-full h-auto border border-foreground/70 rounded-lg overflow-hidden cursor-pointer",
            item.statusCode === "error" && "border-red-400"
          )}
          onClick={() =>
            setSelectedIndex(index === selectedIndex ? null : index)
          }
        >
          <Image
            src={item.thumbnail}
            alt="Thumbnail"
            width={200}
            height={200}
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
          />

          <div
            className={cn(
              "absolute w-full h-full z-[5] top-0 left-0 bg-cover bg-center bg-gradient-to-r bg-no-repeat from-background to-background/80",
              item.statusCode === "error" && "bg-red-400/50"
            )}
          />

          <div
            className={`relative min-h-[170px] max-h-[250px] 
                    flex flex-col justify-between items-stretch gap-2 px-4 py-4
                    z-10`}
          >
            <div className={`flex flex-row justify-start gap-2`}>
              <div
                className={cn(
                  "grid place-items-center w-8 h-8 bg-background rounded-md",
                  item.statusCode === "error" && "text-red-400"
                )}
              >
                {index + 1}
              </div>

              {item.statusCode === "done" ? (
                <h2 className={`text-base font-semibold flex-grow`}>
                  {item.response?.title}
                </h2>
              ) : item.statusCode === "error" ? (
                <h2
                  className={`text-base font-semibold flex-grow text-red-400`}
                >
                  Error
                </h2>
              ) : (
                <div className="flex flex-col gap-1 flex-grow">
                  <Skeleton className="w-32 h-4 bg-primary/20" />
                  <Skeleton className="w-24 h-4 bg-primary/20" />
                </div>
              )}

              <Button
                variant="outline"
                className={`flex-shrink-0 text-xl p-2 rounded-full duration-1000 ${
                  scrappingIndex === index && "animate-spin"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  scrapeSingleCourse(index);
                }}
                disabled={
                  (item.statusCode !== "done" && item.statusCode !== "error") ||
                  scrappingIndex !== null
                }
              >
                <FaArrowRotateRight />
              </Button>

              <span className={`text-xl`}>
                <FaAngleDown
                  className={`inline-block transition-all duration-300 ${
                    selectedIndex === index && "rotate-180"
                  }`}
                />
              </span>
            </div>

            {item.statusCode === "done" ? (
              <p className={`text-sm`}>
                {(item.response?.description || "").slice(0, 100)}...
              </p>
            ) : item.statusCode === "error" ? (
              <p className={`text-sm`}>
                {item.error || "An error occurred while fetching data."}
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                <Skeleton className="w-60 h-4 bg-primary/20" />
                <Skeleton className="w-44 h-4 bg-primary/20" />
              </div>
            )}
          </div>
        </div>

        {/* Overlay */}
        <div
          className={cn(
            "absolute z-20 w-0 h-0 left-[calc(50%-10px)]",
            "transition-all duration-300",
            "border-l-[10px] border-r-[10px] border-b-[10px] border-transparent border-b-muted",
            selectedIndex === index
              ? "-bottom-6 opacity-100"
              : " bottom-0 opacity-0"
          )}
        />
      </div>

      {/* Expanded Details */}
      <div
        key={index}
        className={cn(
          "w-full h-auto relative z-20 left-0 overflow-hidden",
          "transition-all duration-300",
          // Two Clildren
          "[@media(min-width:1280px)]:w-[calc(200%+0.5rem)]",
          index % 2 === 1 &&
            "[@media(min-width:1280px)_and_(max-width:1675px)]:-ml-[calc(100%+0.5rem)]",
          // Three Children
          "[@media(min-width:1675px)]:w-[calc(300%+1rem)]",
          index % 3 === 1 &&
            "[@media(min-width:1675px)_and_(max-width:2070px)]:-ml-[calc(100%+0.5rem)]",
          index % 3 === 2 &&
            "[@media(min-width:1675px)_and_(max-width:2070px)]:-ml-[calc(200%+1rem)]",
          // Four Children
          "[@media(min-width:2070px)]:w-[calc(400%+1.5rem)]",
          index % 4 === 1 &&
            "[@media(min-width:2070px)_and_(max-width:2465px)]:-ml-[calc(100%+0.5rem)]",
          index % 4 === 2 &&
            "[@media(min-width:2070px)_and_(max-width:2465px)]:-ml-[calc(200%+1rem)]",
          index % 4 === 3 &&
            "[@media(min-width:2070px)_and_(max-width:2465px)]:-ml-[calc(300%+1.5rem)]",
          // Five Children
          "[@media(min-width:2465px)]:w-[calc(500%+2rem)]",
          index % 5 === 1 &&
            "[@media(min-width:2465px)]:-ml-[calc(100%+0.5rem)]",
          index % 5 === 2 && "[@media(min-width:2465px)]:-ml-[calc(200%+1rem)]",
          index % 5 === 3 &&
            "[@media(min-width:2465px)]:-ml-[calc(300%+1.5rem)]",
          index % 5 === 4 && "[@media(min-width:2465px)]:-ml-[calc(400%+2rem)]",
          selectedIndex === index
            ? "max-h-[3000px] py-2 mt-4 opacity-100"
            : "max-h-0 opacity-0"
        )}
      >
        <div className="relative w-full border rounded-md bg-background/95">
          {item.statusCode === "done" ? (
            <div className="flex flex-col gap-2 p-2">
              {/* Top */}
              <div className="flex flex-row flex-wrap">
                {/* Hero Section */}
                <div className="flex flex-row gap-2 items-center">
                  <div className="w-56 h-32 bg-gray-800 rounded-md border overflow-hidden flex-shrink-0">
                    <Image
                      src={item.response?.thumbnail || ""}
                      alt="Thumbnail"
                      width={228}
                      height={128}
                      className="w-auto h-full object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-col gap-2 max-w-md">
                    <p className="text-lg font-bold">
                      {item.response?.title || ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Instructors:{" "}
                      </span>
                      {item.response?.instructors.slice(0, 3).join(", ")}
                      {(item.response?.instructors.length || 0) > 3 && (
                        <HoverCard>
                          &nbsp;&{" "}
                          <HoverCardTrigger asChild>
                            <span className="underline cursor-pointer">
                              {(item.response?.instructors.length || 0) - 3}{" "}
                              more.
                            </span>
                          </HoverCardTrigger>
                          <HoverCardContent>
                            <h2 className="text-lg font-semibold">
                              Instructors
                            </h2>
                            <ol className="list-decimal list-inside">
                              {item.response?.instructors.map(
                                (instructor, index) => (
                                  <li key={index}>{instructor}</li>
                                )
                              )}
                            </ol>
                          </HoverCardContent>
                        </HoverCard>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Description:{" "}
                      </span>
                      {item.response?.description}
                    </p>
                  </div>
                </div>

                {/* Tools Section */}
                <div className="flex flex-row flex-wrap flex-grow gap-2 p-2 border rounded-md">
                  {/* JSON Response Preview */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <CodeIcon className="w-6 h-6" />
                        Response
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full md:w-[1024px] max-w-full">
                      <DialogHeader>
                        <DialogTitle>JSON Response</DialogTitle>
                        <DialogDescription>
                          The JSON response from the server for this course.
                        </DialogDescription>
                      </DialogHeader>
                      <pre className="w-[calc(100%-48px)] md:w-[calc(1024px-48px)] text-sm border rounded-md">
                        <ScrollArea
                          className="w-full h-[400px] p-2"
                          orientation="both"
                        >
                          <code>{JSON.stringify(item, null, 2)}</code>
                        </ScrollArea>
                      </pre>
                    </DialogContent>
                  </Dialog>
                  {/* Open Course in new tab */}
                  <Button asChild variant="outline" className="gap-2">
                    <a
                      href={item.response?.redirectLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <OpenInNewWindowIcon className="w-6 h-6" />
                      Open Course
                    </a>
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <ScrollArea orientation="horizontal" className="w-full pb-2.5">
                <div className="flex flex-row gap-2 whitespace-nowrap">
                  {item.response?.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-accent rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </ScrollArea>

              {/* Outcomes */}
              <div className="flex flex-col gap-2">
                <p className="text-base font-semibold">Outcomes</p>
                <p className="text-sm text-muted-foreground">
                  {item.response?.outcomes}
                </p>
              </div>

              {/* Grid Auto To Display Short Information */}
              <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
                {/* Experience */}
                <div className="flex flex-col gap-2 border rounded-md p-2">
                  <p className="text-base font-semibold">Experience</p>
                  <p className="text-sm text-muted-foreground">
                    {item.response?.experience}
                  </p>
                </div>
                {/* Duration */}
                <div className="flex flex-col gap-2 border rounded-md p-2">
                  <p className="text-base font-semibold">Duration</p>
                  <p className="text-sm text-muted-foreground">
                    {item.response?.duration}
                  </p>
                </div>
                {/* Rating */}
                <div className="flex flex-col gap-2 border rounded-md p-2">
                  <p className="text-base font-semibold">Rating</p>
                  <p className="text-sm text-muted-foreground">
                    {item.response?.rating}
                  </p>
                </div>
                {/* Total Enrolled Students */}
                <div className="flex flex-col gap-2 border rounded-md p-2">
                  <p className="text-base font-semibold">Total Enrolled</p>
                  <p className="text-sm text-muted-foreground">
                    {item.response?.total_enrolled_students}
                  </p>
                </div>
                {/* Reviews */}
                <div className="flex flex-col gap-2 border rounded-md p-2">
                  <p className="text-base font-semibold">Reviews</p>
                  <p className="text-sm text-muted-foreground">
                    {item.response?.reviews}
                  </p>
                </div>
                {/* Average Salary */}
                <div className="flex flex-col gap-2 border rounded-md p-2">
                  <p className="text-base font-semibold">Average Salary</p>
                  <p className="text-sm text-muted-foreground">
                    {item.response?.avg_salary}
                  </p>
                </div>
                {/* Job Openings */}
                <div className="flex flex-col gap-2 border rounded-md p-2">
                  <p className="text-base font-semibold">Job Openings</p>
                  <p className="text-sm text-muted-foreground">
                    {item.response?.job_openings}
                  </p>
                </div>
                {/* Guarantee Percentage */}
                <div className="flex flex-col gap-2 border rounded-md p-2">
                  <p className="text-base font-semibold">
                    Guarantee Percentage
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.response?.guarantee_percentage}
                  </p>
                </div>
              </div>

              {/* What You Will Learn */}
              <div className="flex flex-col gap-2">
                <p className="text-base font-semibold">What You Will Learn</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground pl-4">
                  {item.response?.what_you_will_learn.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              {/* Series using Acordition */}
              <p className="text-lg font-medium">Available Series</p>
              <Accordion
                type="single"
                collapsible
                className="w-full flex flex-row flex-wrap gap-2 items-start"
              >
                {item.response?.series.map((series, index) => (
                  <AccordionItem
                    value={`${index}`}
                    key={index}
                    className="w-full [@media(min-width:1280px)]:w-[calc(50%-8px)] border rounded-md p-2"
                  >
                    <AccordionTrigger className="p-0 text-base font-medium">
                      {series.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                          {series.duration}
                        </p>
                        <p className="text-sm font-semibold">
                          Rating:{" "}
                          <span className="font-normal text-muted-foreground">
                            {series.rating}
                          </span>
                        </p>
                        <div className="flex flex-row gap-2">
                          <p className="text-sm font-semibold">Tags:</p>
                          <div className="flex flex-wrap gap-2">
                            {series.internalTags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-accent rounded-md text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm font-semibold">
                          What You Will Learn
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground pl-4">
                          {series.whatYouWillLearn.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : item.statusCode === "error" ? (
            <div className="flex flex-col gap-2 p-2">
              <p className="text-base font-semibold">Error</p>
              <p className="text-sm text-red-400">{item.error}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-2 pt-4 pb-8">
              <Skeleton className="w-4/5 h-4 bg-primary/20" />
              <Skeleton className="w-3/5 h-4 bg-primary/20" />
              <Skeleton className="w-2/5 h-4 bg-primary/20" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

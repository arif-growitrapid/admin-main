"use client";

import React from "react";
import { z } from "zod";
import * as XLSX from "xlsx";
import {
  COURSERA_COURSE_SCHEMA,
  COURSE_PROVIDERS_SCHEMA,
  COURSE_PROVIDER_KEYS,
} from "./courses.types";
import { Button } from "@/components/ui/button";
import { FaAngleDown, FaPlus, FaTrash } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  VscCloudDownload,
  VscCloudUpload,
  VscLoading,
  VscVmConnect,
} from "react-icons/vsc";
import { socket } from "./socket";
import { toast } from "@/components/ui/use-toast";
import {
  CodeIcon,
  OpenInNewWindowIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { cn } from "@/lib/utils";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const serverRequestDataSchema = z.object({
  id: z.string(),
  url: z.string(),
  thumbnail: z.string(),
  provider: z.enum(COURSE_PROVIDER_KEYS),
});

const serverRequestSchema = z.object({
  tag: z.string(),
  data: z.array(serverRequestDataSchema),
});

const serverResponseDataSchema = z.object({
  id: z.string(),
  url: z.string(),
  thumbnail: z.string(),
  provider: z.enum(COURSE_PROVIDER_KEYS),
  statusCode: z.enum(["pending", "parsing", "done", "error"]),

  // Optional fields.
  response: COURSE_PROVIDERS_SCHEMA.optional(),
  status: z.string().optional(),
  error: z.string().optional(),
});

const serverResponseSchema = z.object({
  tag: z.string(),
  status: z.enum(["parsing", "done", "error", "partial_error"]),
  data: z.array(serverResponseDataSchema).optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

const test = {
  id: "1",
  url: "https://imp.i384100.net/jr549M",
  thumbnail:
    "https://res.cloudinary.com/dgnbzbm19/image/upload/v1710668834/Frame_1_2_hdtznd.png",
  provider: "coursera",
  statusCode: "done",
  response: {
    provider: "coursera",
    title: "Google Data Analytics Professional Certificate",
    description:
      "Get on the fast track to a career in Data Analytics. In this certificate program, you'll learn in-demand skills at your own pace, no degree or experience required.",
    thumbnail:
      "https://res.cloudinary.com/dgnbzbm19/image/upload/v1710668834/Frame_1_2_hdtznd.png",
    instructors: [
      "Google Career Certificates",
      "Google",
      "Google Cloud Professional Certificate",
      "Google Cloud",
      "Google Cloud Training",
      "Google Cloud Platform",
      "Google Cloud Professional Certificate Program",
    ],
    total_enrolled_students: "2068512",
    rating: "4.8",
    duration: "6 months at 10 hours a week",
    experience: "Beginner level No degree or prior experience required",
    reviews: "133470",
    what_you_will_learn: [
      "Gain an immersive understanding of the practices and processes used by a junior or associate data analyst in their day-to-day job",
      "Learn key analytical skills (data cleaning, analysis, & visualization) and tools (spreadsheets, SQL, R programming, Tableau)",
      "Understand how to clean and organize data for analysis, and complete analysis and calculations using spreadsheets, SQL and R programming",
      "Learn how to visualize and present data findings in dashboards, presentations and commonly used visualization platforms",
    ],
    tags: [
      "Data Analysis",
      "Creating case studies",
      "Data Visualization",
      "Data Cleansing",
      "Developing a portfolio",
      "Data Collection",
      "Spreadsheet",
      "Metadata",
      "SQL",
      "Data Ethics",
      "Data Aggregation",
      "Data Calculations",
      "R Markdown",
      "R Programming",
      "Rstudio",
      "Tableau Software",
      "Presentation",
      "Data Integrity",
      "Sample Size Determination",
      "Decision-Making",
      "Problem Solving",
      "Questioning",
    ],
    avg_salary: "$92,000+",
    job_openings: "483,000+",
    guarantee_percentage: "75%",
    outcomes:
      "Receive professional-level training from Google Demonstrate your proficiency in portfolio-ready projects Earn an employer-recognized certificate from Google Qualify for in-demand job titles: Data Analyst, Junior Data Analyst, Associate Data Analyst",
    series: [
      {
        title: "Foundations: Data, Data, Everywhere",
        link: "/learn/foundations-data?specialization=google-data-analytics",
        duration: "18 hours",
        rating: "4.8",
        internalTags: [
          "Spreadsheet",
          "Data Integrity",
          "Sample Size Determination",
          "SQL",
          "Data Cleansing",
        ],
        whatYouWillLearn: [
          "Define and explain key concepts involved in data analytics including data, data analysis, and data ecosystems.",
          "Conduct an analytical thinking self assessment giving specific examples of the application of analytical thinking.",
          "Discuss the role of spreadsheets, query languages, and data visualization tools in data analytics.",
          "Describe the role of a data analyst with specific reference to jobs.",
        ],
      },
      {
        title: "Ask Questions to Make Data-Driven Decisions",
        link: "/learn/ask-questions-make-decisions?specialization=google-data-analytics",
        duration: "21 hours",
        rating: "4.7",
        internalTags: [
          "Data Analysis",
          "Creating case studies",
          "Data Visualization",
          "Data Cleansing",
          "Developing a portfolio",
        ],
        whatYouWillLearn: [
          "Explain how the problem-solving road map applies to typical analysis scenarios.",
          "Discuss the use of data in the decision-making process.",
          "Demonstrate the use of spreadsheets to complete basic tasks of the data analyst including entering and organizing data.",
          "Describe the key ideas associated with structured thinking.",
        ],
      },
      {
        title: "Prepare Data for Exploration",
        link: "/learn/data-preparation?specialization=google-data-analytics",
        duration: "25 hours",
        rating: "4.8",
        internalTags: [
          "Decision-Making",
          "Spreadsheet",
          "Data Analysis",
          "Problem Solving",
          "Questioning",
        ],
        whatYouWillLearn: [
          "Explain what factors to consider when making decisions about data collection.",
          "Discuss the difference between biased and unbiased data.",
          "Describe databases with references to their functions and components.",
          "Describe best practices for organizing data.",
        ],
      },
      {
        title: "Process Data from Dirty to Clean",
        link: "/learn/process-data?specialization=google-data-analytics",
        duration: "26 hours",
        rating: "4.8",
        internalTags: [
          "Data Analysis",
          "R Markdown",
          "Data Visualization",
          "R Programming",
          "Rstudio",
        ],
        whatYouWillLearn: [
          "Define different types of data integrity and identify risks to data integrity.",
          "Apply basic SQL functions to clean string variables in a database.",
          "Develop basic SQL queries for use on databases.",
          "Describe the process of verifying data cleaning results.",
        ],
      },
      {
        title: "Analyze Data to Answer Questions",
        link: "/learn/analyze-data?specialization=google-data-analytics",
        duration: "32 hours",
        rating: "4.6",
        internalTags: [
          "Data Aggregation",
          "Spreadsheet",
          "Data Analysis",
          "Data Calculations",
          "SQL",
        ],
        whatYouWillLearn: [
          "Discuss the importance of organizing your data before analysis by using sorts and filters.",
          "Convert and format data.",
          "Apply the use of functions and syntax to create SQL queries to combine data from multiple database tables.",
          "Describe the use of functions to conduct basic calculations on data in spreadsheets.",
        ],
      },
      {
        title: "Share Data Through the Art of Visualization",
        link: "/learn/visualize-data?specialization=google-data-analytics",
        duration: "25 hours",
        rating: "4.6",
        internalTags: [
          "Data Collection",
          "Spreadsheet",
          "Metadata",
          "SQL",
          "Data Ethics",
        ],
        whatYouWillLearn: [
          "Describe the use of data visualizations to talk about data and the results of data analysis.",
          "Identify Tableau as a data visualization tool and understand its uses.",
          "Explain what data driven stories are including reference to their importance and their attributes.",
          "Explain principles and practices associated with effective presentations.",
        ],
      },
      {
        title: "Data Analysis with R Programming",
        link: "/learn/data-analysis-r?specialization=google-data-analytics",
        duration: "35 hours",
        rating: "4.8",
        internalTags: [
          "Data Analysis",
          "Tableau Software",
          "Data Visualization",
          "Presentation",
        ],
        whatYouWillLearn: [
          "Describe the R programming language and its programming environment.",
          "Explain the fundamental concepts associated with programming in R including functions, variables, data types, pipes, and vectors.",
          "Describe the options for generating visualizations in R.",
          "Demonstrate an understanding of the basic formatting in R Markdown to create structure and emphasize content.",
        ],
      },
      {
        title: "Google Data Analytics Capstone: Complete a Case Study",
        link: "/learn/google-data-analytics-capstone?specialization=google-data-analytics",
        duration: "11 hours",
        rating: "4.8",
        internalTags: [
          "Spreadsheet",
          "Data Analysis",
          "SQL",
          "Data Visualization",
          "Data Cleansing",
        ],
        whatYouWillLearn: [
          "Differentiate between a capstone project, case study, and a portfolio.",
          "Identify the key features and attributes of a completed case study.",
          "Apply the practices and procedures associated with the data analysis process to a given set of data.",
          "Discuss the use of case studies/portfolios when communicating with recruiters and potential employers.",
        ],
      },
    ],
    redirectLink: "https://imp.i384100.net/jr549M",
  },
  status: "done",
};

export default function Page({}: {}) {
  const [isSocketConnected, setIsSocketConnected] = React.useState(
    socket.connected
  );
  const [data, setData] = React.useState<
    z.infer<typeof serverResponseSchema> | undefined
  >();
  // {
  //   tag: "4/13/2024, 11:39:33 PM",
  //   status: "done",
  //   data: Array.from(
  //     { length: 10 },
  //     (_, index) =>
  //       ({
  //         ...test,
  //         id: (index + 1).toString(),
  //         statusCode: index > 5 ? "pending" : "done",
  //         response: index > 5 ? undefined : test.response,
  //       }) as z.infer<typeof serverResponseDataSchema>
  //   ),
  //   message: "",
  // }
  const [dataToUpload, setDataToUpload] = React.useState<
    z.infer<typeof serverRequestSchema>["data"]
  >([
    {
      id: "",
      url: "",
      thumbnail: "",
      provider: "coursera",
    },
  ]);
  const [isScraping, setIsScraping] = React.useState(false);
  const [tag, setTag] = React.useState<string>(new Date().toLocaleString());
  const [timeElapsed, setTimeElapsed] = React.useState({
    time: 0,
    startTime: Date.now(),
  });
  const timeElapsedInterval = React.useRef<NodeJS.Timeout | null>(null);

  const onSheetUpload = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet) as {
          url: string;
          thumbnail: string;
        }[];

        setDataToUpload((t) => [
          ...t,
          ...data.map((item, index) => ({
            id: t.length + index + 1 + "",
            url: item.url,
            thumbnail: item.thumbnail,
            provider: "coursera" as any,
          })),
        ]);
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  React.useEffect(() => {
    function onConnect() {
      setIsSocketConnected(true);
      toast({
        title: "Connected to the server",
        description: "You can now upload data to the server.",
      });
    }

    function onDisconnect() {
      setIsSocketConnected(false);
      toast({
        title: "Disconnected from the server",
        description: "You can no longer upload data to the server.",
      });

      // Reset everything.
      setIsScraping(false);
      setData(undefined);
      if (timeElapsedInterval.current) {
        clearInterval(timeElapsedInterval.current);
        timeElapsedInterval.current = null;
      }
      setTimeElapsed({
        time: 0,
        startTime: Date.now(),
      });
    }

    function onScrapData(data: z.infer<typeof serverResponseSchema>) {
      setData(data);
      if (data.status === "done" || data.status === "error") {
        setIsScraping(false);
        if (timeElapsedInterval.current) {
          clearInterval(timeElapsedInterval.current);
          timeElapsedInterval.current = null;
        }
        toast({
          title: "Scraping data complete",
          description: "You can now upload the data to the server.",
        });
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("course:scraper", onScrapData);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("course:scraper", onScrapData);
    };
  }, [timeElapsed]);

  function scrapData() {
    setIsScraping(true);
    if (timeElapsedInterval.current) {
      clearInterval(timeElapsedInterval.current);
      timeElapsedInterval.current = null;
    }
    setTimeElapsed((prev) => ({
      ...prev,
      time: 0,
      startTime: Date.now(),
    }));
    timeElapsedInterval.current = setInterval(() => {
      setTimeElapsed((prev) => ({
        ...prev,
        time: Date.now() - prev.startTime,
      }));
    }, 100);

    // Trigger the server to start scraping.
    socket.emit("course:scraper", {
      tag,
      data: dataToUpload,
    });
  }

  function uploadData() {}

  return (
    <div className="w-full h-full p-2">
      <div className="flex flex-row gap-2 items-stretch justify-stretch h-[calc(100%-55px)] pb-2">
        <div className="w-[28rem] border rounded-md">
          <header className="flex flex-row gap-2 p-2 items-center">
            <div>
              <p className="text-base font-semibold">Data To Upload</p>
              <p className="text-sm text-muted-foreground">
                Data that will be uploaded to the server.
              </p>
            </div>
            <div className="flex-1" />
            <Button
              onClick={() => {
                setDataToUpload([]);
              }}
              variant="destructive"
              size="icon"
            >
              <FaTrash />
            </Button>
            <Button
              onClick={() => {
                setDataToUpload((prev) => [
                  ...prev,
                  {
                    id: "",
                    url: "",
                    thumbnail: "",
                    provider: "coursera",
                  },
                ]);
              }}
              variant="outline"
              size="icon"
            >
              <FaPlus />
            </Button>
          </header>

          <ScrollArea className="mt-2" style={{ height: "calc(100% - 5rem)" }}>
            <div className="flex flex-col gap-2 p-2 px-3">
              {dataToUpload.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row flex-wrap gap-2 items-center border rounded-md"
                >
                  <div className="w-full flex flex-row gap-2 flex-grow p-1 pb-0">
                    <div className="grid place-items-center w-8 h-8 bg-gray-800 rounded-md">
                      {index + 1}
                    </div>
                    <Input
                      type="text"
                      value={item.url}
                      onChange={(e) => {
                        setDataToUpload((prev) => {
                          const copy = [...prev];
                          copy[index].url = e.target.value;
                          return copy;
                        });
                      }}
                      placeholder="URL"
                      className="flex-grow p-2 border-0 border-b !outline-none !ring-0"
                    />
                  </div>

                  <div className="w-full flex flex-row gap-2 items-center p-1 pt-0">
                    <Input
                      type="text"
                      value={item.thumbnail}
                      onChange={(e) => {
                        setDataToUpload((prev) => {
                          const copy = [...prev];
                          copy[index].thumbnail = e.target.value;
                          return copy;
                        });
                      }}
                      placeholder="Thumbnail"
                      className="w-auto flex-grow p-2 border-0 border-b !outline-none !ring-0"
                    />
                    <Select
                      defaultValue={item.provider}
                      onValueChange={(value) => {
                        setDataToUpload((prev) => {
                          const copy = [...prev];
                          copy[index].provider = value as any;
                          return copy;
                        });
                      }}
                    >
                      <SelectTrigger className="w-36 flex-shrink-0">
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {COURSE_PROVIDER_KEYS.map((key) => (
                          <SelectItem
                            key={key}
                            value={key}
                            disabled={key !== "coursera"}
                          >
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => {
                        setDataToUpload((prev) => {
                          const copy = [...prev];
                          copy.splice(index, 1);
                          return copy;
                        });
                      }}
                      variant="destructive"
                      size="icon"
                      className="flex-shrink-0"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="h-full border rounded-md w-[calc(100%-28rem)] overflow-hidden">
          <div className="flex flex-row gap-2 p-2 items-center border-b">
            <div className="flex flex-row gap-2 items-center whitespace-nowrap">
              {isScraping ? (
                <VscLoading className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                <VscCloudDownload className="w-6 h-6 text-muted-foreground" />
              )}
              <p className="text-base font-semibold text-muted-foreground">
                {isScraping
                  ? `Scraping ${data?.data?.length} Data`
                  : data?.status === "done"
                    ? `Scraped ${data?.data?.length} Data`
                    : data?.status === "error"
                      ? "An error occurred while scraping data."
                      : "Scrapped Data"}
              </p>
              <hr className="w-[1px] h-6 bg-muted-foreground" />
              <p className="text-sm text-green-400">
                Success:{" "}
                {data?.data
                  ? data.data.filter((t) => t.statusCode === "done").length
                  : 0}{" "}
              </p>
              <hr className="w-[1px] h-6 bg-muted-foreground" />
              <p className="text-sm text-red-400">
                Error:{" "}
                {data?.data
                  ? data.data.filter((t) => t.statusCode === "error").length
                  : 0}{" "}
              </p>
              <hr className="w-[1px] h-6 bg-muted-foreground" />
              <p className="text-sm text-yellow-400">
                Pending:{" "}
                {data?.data
                  ? data.data.filter((t) => t.statusCode === "pending").length +
                    data.data.filter((t) => t.statusCode === "parsing").length
                  : 0}{" "}
              </p>
            </div>
            <div className="flex-1" />
            <div className="flex flex-row gap-2 items-center border rounded-md py-1 px-2 min-w-[8rem] whitespace-nowrap">
              <StopwatchIcon className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Time Elapsed:</p>
              <div className="flex-1" />
              <p className="text-sm text-muted-foreground font-mono">
                {(timeElapsed.time / 1000).toFixed(3)} s
              </p>
            </div>
          </div>
          <div className="h-[calc(100%-48px)] w-full">
            {data?.data ? (
              <ScrollArea className="w-full h-full" orientation="vertical">
                <CoursesList data={data.data} />
              </ScrollArea>
            ) : (
              <div className="flex flex-col gap-2 items-center justify-center h-full">
                <p className="text-base font-semibold text-muted-foreground">
                  No Data
                </p>
                <p className="text-sm text-muted-foreground">
                  Scraped data will be displayed here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="">
        <div className="flex flex-row gap-2 p-2 items-center border rounded-md">
          <Input
            type="file"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                onSheetUpload(Array.from(files));
              }
            }}
            accept="application/vnd.ms-excel, .csv, .xlsx"
            className="w-auto p-2 border rounded-md"
          />
          <Input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag"
            className="w-auto p-2 border rounded-md"
          />

          <div className="flex-grow" />

          <Button
            disabled={isSocketConnected}
            onClick={() => socket.connect()}
            variant="outline"
          >
            <VscVmConnect className="mr-2 w-6 h-6" />
            {isSocketConnected ? "Connected" : "Connect"}
          </Button>

          <Button onClick={scrapData}>
            {isScraping ? (
              <VscLoading className="mr-2 w-6 h-6 animate-spin" />
            ) : (
              <VscCloudDownload className="mr-2 w-6 h-6" />
            )}
            Scrap Data
          </Button>
          <Button onClick={uploadData}>
            <VscCloudUpload className="mr-2 w-6 h-6" />
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}

function CoursesList({
  data,
}: {
  data: z.infer<typeof serverResponseDataSchema>[];
}) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Cards Layout */}
      {/* <div className="relative grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(384px,1fr))] p-2"> */}
      <div className="relative grid gap-2 p-2 grid-cols-1 [@media(min-width:1280px)]:grid-cols-2 [@media(min-width:1675px)]:grid-cols-3 [@media(min-width:2070px)]:grid-cols-4 [@media(min-width:2465px)]:grid-cols-5">
        {data.map(
          (item, index) =>
            item.provider === "coursera" && (
              <CourseraCourseCard
                key={index}
                item={item as any}
                index={index}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
              />
            )
        )}
      </div>
    </div>
  );
}

function CourseraCourseCard({
  item,
  index,
  selectedIndex,
  setSelectedIndex,
}: {
  // Forcing the item to be of type COURSERA_COURSE_SCHEMA
  item: z.infer<typeof serverResponseDataSchema> & {
    provider: "coursera";
    response: z.infer<typeof COURSERA_COURSE_SCHEMA>;
  };
  index: number;
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
}) {
  if (item.provider !== "coursera") return null;

  return (
    <div key={index} className="w-full">
      {/* Card */}
      <div className="relative overflow-visible text-foreground">
        <div
          className="relative w-full h-auto border border-foreground/70 rounded-lg overflow-hidden cursor-pointer"
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

          <div className="absolute w-full h-full z-[5] top-0 left-0 bg-cover bg-center bg-gradient-to-r bg-no-repeat from-background to-background/80" />

          <div
            className={`relative min-h-[170px] max-h-[250px] 
                    flex flex-col justify-between items-stretch gap-2 px-4 py-4
                    z-10`}
          >
            <div className={`flex flex-row justify-start gap-2`}>
              <div className="grid place-items-center w-8 h-8 bg-background rounded-md">
                {index + 1}
              </div>

              {item.statusCode === "done" ? (
                <h2 className={`text-base font-semibold flex-grow`}>
                  {item.response?.title}
                </h2>
              ) : item.statusCode === "error" ? (
                <h2 className={`text-base font-semibold flex-grow`}>Error</h2>
              ) : (
                <div className="flex flex-col gap-1 flex-grow">
                  <Skeleton className="w-32 h-4 bg-primary/20" />
                  <Skeleton className="w-24 h-4 bg-primary/20" />
                </div>
              )}

              <span className={`text-xl`}>
                <FaAngleDown className={`inline-block`} />
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

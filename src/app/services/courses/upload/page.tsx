"use client";

import React from "react";
import { z } from "zod";
import * as XLSX from "xlsx";
import { COURSE_PROVIDERS_SCHEMA, COURSE_PROVIDER_KEYS } from "./courses.types";
import { Button } from "@/components/ui/button";
import { FaPlus, FaTrash } from "react-icons/fa6";
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

export default function Page({}: {}) {
  const [isSocketConnected, setIsSocketConnected] = React.useState(
    socket.connected
  );
  const [data, setData] =
    React.useState<z.infer<typeof serverResponseSchema>>();
  const [isScraping, setIsScraping] = React.useState(false);
  const [tag, setTag] = React.useState<string>(new Date().toLocaleString());
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
    }

    function onScrapData(data: z.infer<typeof serverResponseSchema>) {
      setData(data);
      if (data.status === "done") {
        setIsScraping(false);
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
  }, []);

  function scrapData() {
    setIsScraping(true);
    socket.emit("course:scraper", {
      tag,
      data: dataToUpload,
    });
  }

  function uploadData() {}

  return (
    <div className="w-full h-full p-2">
      <div className="flex flex-row gap-2 items-stretch flex-grow h-[calc(100%-55px)] pb-2">
        <div className="w-[30rem] border rounded-md">
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
                          <SelectItem key={key} value={key}>
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

        <div className="flex-grow h-full p-2 border rounded-md overflow-auto">
          <pre>{JSON.stringify(data, null, 2)}</pre>
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

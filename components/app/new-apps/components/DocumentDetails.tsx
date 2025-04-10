"use client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC } from "react";
import Image from "next/image";

interface DocumentDetailsProps {
    items: {
        value: string,
        title: string
        image: string
    }[];
}
export const DocumentDetails: FC<DocumentDetailsProps> = ({ items }) => {
    return (<div>
        <section className="content-center flex justify-center w-full ">
            <Tabs defaultValue={items[0]?.value || ""} className="w-full">
                <div className="w-full flex-1 rounded-lg bg-white items-center">
                    <TabsList className="flex  justify-between bg-white">
                        <div className="flex justify-between">
                            {items.map((item) => (
                                <TabsTrigger
                                    key={item.value}
                                    className="data-[state=active]:bg-gray-300 px-5 py-2"
                                    value={item.value}
                                >
                                    {item.title}
                                </TabsTrigger>
                            ))}
                        </div>
                    </TabsList>
                </div>
                {items.map((item) => (
                    <TabsContent
                        value={item.value}
                        className="bg-white rounded-xl"
                    >
                        <Card className="rounded-m border-grey px-2 py-6">
                            <div className=" flex flex-row justify-center">
                                <Image
                                    className="h-auto w-auto"
                                    src={item.image}
                                    alt={item.title}
                                    width={1000}
                                    height={1000}
                                />
                            </div>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    </div>);
}

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import 'leaflet/dist/leaflet.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import DraggableContainer from '@/components/MpDrag/DraggableContainer';

export const metadata: Metadata = {
  title:
    "Trimming Digital Board Dashboard | Toyota",
  description: "This is the dashboard for the Trimming Digital Board",
  icons: "/images/logo/toyota-logo.svg",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <DraggableContainer />
      </DefaultLayout>
    </>
  );
}

"use client"

import { GraphDataInt } from "@/interface/graph-data";
import { FC, useLayoutEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface OverviewProps {
  data: GraphDataInt[],
}

const Overview: FC<OverviewProps> = (props) => {
  const { data } = props;
  const [isClient, setIsClient] = useState<boolean>(false);

  useLayoutEffect(() => setIsClient(true), [setIsClient])
  if(!isClient) return null;

  return (
    <ResponsiveContainer width="95%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="uv" barSize={30} fill="#8884d8"/>
      </BarChart>
    </ResponsiveContainer>
  )
}

export { Overview };
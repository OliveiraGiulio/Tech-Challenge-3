// app/(dashboard)/page.jsx  – Next.js 13+ “/app” router
"use client";

import { ChangeEvent } from "react";
import { FormEvent } from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { HeartPulse, TrendingUp } from "lucide-react";

export default function Dashboard() {
  // local list of submissions for the demo
  const [records, setRecords] = useState([]);

  // form state — minimal subset of features for demo
  const [form, setForm] = useState({
    Age: "",
    Sex: "M",
    ChestPainType: "ASY",
    RestingBP: "",
    Cholesterol: "",
    FastingBS: 0,
    RestingECG: "Normal",
    MaxHR: "",
    ExerciseAngina: "N",
    Oldpeak: "",
    ST_Slope: "Flat",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const API = "http://127.0.0.1:8000/predict"; 

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, RestingBP: Number(form.RestingBP) || null, Cholesterol: Number(form.Cholesterol) || null, MaxHR: Number(form.MaxHR) || null, Oldpeak: Number(form.Oldpeak) }),
    });
    const data = await res.json();
    setRecords((prev) => [
      {
        id: prev.length + 1,
        probability: data.probability.toFixed(3),
        hasDisease: data.has_disease,
      },
      ...prev,
    ]);
  };

  return (
    <div className="container mx-auto p-4 grid gap-6 lg:grid-cols-2">
      {/* ---------- Form card ---------- */}
      <Card className="bg-white shadow-xl rounded-2xl p-6">
        <CardContent>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <HeartPulse className="w-5 h-5" /> New Prediction
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Age" name="Age" value={form.Age} onChange={handleChange} required />
            <Input placeholder="Resting BP" name="RestingBP" value={form.RestingBP} onChange={handleChange} />
            <Input placeholder="Cholesterol" name="Cholesterol" value={form.Cholesterol} onChange={handleChange} />
            <Input placeholder="Max HR" name="MaxHR" value={form.MaxHR} onChange={handleChange} />
            <Input placeholder="Oldpeak" name="Oldpeak" value={form.Oldpeak} onChange={handleChange} />
            {/* simple selects */}
            <select name="Sex" value={form.Sex} onChange={handleChange} className="border rounded-lg p-2">
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            <select name="ExerciseAngina" value={form.ExerciseAngina} onChange={handleChange} className="border rounded-lg p-2">
              <option value="N">No Angina</option>
              <option value="Y">Yes Angina</option>
            </select>
            <select name="ChestPainType" value={form.ChestPainType} onChange={handleChange} className="border rounded-lg p-2 col-span-2">
              <option value="ASY">Asymptomatic</option>
              <option value="NAP">Non‑Anginal Pain</option>
              <option value="ATA">Atypical Angina</option>
              <option value="TA">Typical Angina</option>
            </select>
            <Button type="submit" className="col-span-2 mt-2">Predict</Button>
          </form>
        </CardContent>
      </Card>

      {/* ---------- Results card ---------- */}
      <Card className="bg-white shadow-xl rounded-2xl p-6 lg:row-span-2">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Predictions Log
          </h2>

          {/* Table of recent predictions */}
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Heart Disease?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id} className={r.hasDisease ? "bg-red-50" : ""}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.probability}</TableCell>
                  <TableCell>{r.hasDisease ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
              {records.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-gray-400">No predictions yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Simple line chart of probabilities */}
          {records.length > 0 && (
            <LineChart width={500} height={200} data={[...records].reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" label={{ value: "Prediction #", position: "insideBottom", dy: 10 }} />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Line type="monotone" dataKey="probability" strokeWidth={2} />
            </LineChart>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

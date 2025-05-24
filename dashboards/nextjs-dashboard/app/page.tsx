// app/(dashboard)/page.tsx — fully typed, Vercel-friendly version
"use client";

import React, {
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { HeartPulse, TrendingUp } from "lucide-react";

/* ------------------------------------------------------------------ */
/* 1 ❘ Type that represents **one** prediction record                  */
/* ------------------------------------------------------------------ */
interface PredictionRow {
  id: number;
  probability: number;
  hasDisease: boolean;
}

/* ------------------------------------------------------------------ */
/* 2 ❘ Input form defaults                                            */
/* ------------------------------------------------------------------ */
const DEFAULT_FORM = {
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
};

/* ------------------------------------------------------------------ */
/* 3 ❘ Dashboard component                                            */
/* ------------------------------------------------------------------ */
export default function Dashboard() {
  /* ---------------- state ---------------------------------------- */
  const [records, setRecords] = useState<PredictionRow[]>([]);
  const [form, setForm] = useState<typeof DEFAULT_FORM>(DEFAULT_FORM);

  /* Base URL: localhost during dev → empty string in Vercel */
  const API_ROOT =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? ""; // remove trailing slash

  /* --------------- handlers ------------------------------------- */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...form,
      RestingBP: Number(form.RestingBP) || null,
      Cholesterol: Number(form.Cholesterol) || null,
      MaxHR: Number(form.MaxHR) || null,
      Oldpeak: Number(form.Oldpeak) || null,
    } as const;

    const res = await fetch(`${API_ROOT}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("API error: " + res.statusText);
      return;
    }

    const data = (await res.json()) as {
      probability: number;
      has_disease: boolean;
    };

    setRecords((prev) => [
      {
        id: prev.length + 1,
        probability: Number(data.probability.toFixed(3)),
        hasDisease: data.has_disease,
      },
      ...prev,
    ]);
  };

  /* ---------------- render -------------------------------------- */
  return (
    <div className="container mx-auto p-4 grid gap-6 lg:grid-cols-2">
      {/* ── Form Card ────────────────────────────── */}
      <Card className="bg-white shadow-xl rounded-2xl p-6">
        <CardContent>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <HeartPulse className="w-5 h-5" /> New Prediction
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            {/* numeric inputs */}
            <Input placeholder="Age" name="Age" value={form.Age} onChange={handleChange} required />
            <Input placeholder="Resting BP" name="RestingBP" value={form.RestingBP} onChange={handleChange} />
            <Input placeholder="Cholesterol" name="Cholesterol" value={form.Cholesterol} onChange={handleChange} />
            <Input placeholder="Max HR" name="MaxHR" value={form.MaxHR} onChange={handleChange} />
            <Input placeholder="Oldpeak" name="Oldpeak" value={form.Oldpeak} onChange={handleChange} />

            {/* categorical selects */}
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
              <option value="NAP">Non-Anginal Pain</option>
              <option value="ATA">Atypical Angina</option>
              <option value="TA">Typical Angina</option>
            </select>

            <Button type="submit" className="col-span-2 mt-2">
              Predict
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Predictions Log Card ─────────────────── */}
      <Card className="bg-white shadow-xl rounded-2xl p-6 lg:row-span-2">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Predictions Log
          </h2>

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
                  <TableCell colSpan={3} className="text-center py-6 text-gray-400">
                    No predictions yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

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
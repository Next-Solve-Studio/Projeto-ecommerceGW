"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import { useLoginForm } from "@/hooks/Auth/useLoginForm";
export default function LoginMain() {

    const {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        loading,
        error,
        expiredByInactivity,
        handleSubmit,
    } = useLoginForm();

    
    return (
        <main
            className="min-h-screen mt-40 flex items-center justify-center"
            style={{ background: "var(--color-grandient-black)" }}
        >
            {/* Glows decorativos */}
            <div
                className="fixed top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-[120px] pointer-events-none"
                style={{ background: "var(--color-blue)" }}
            />
            <div
                className="fixed bottom-0 right-1/4 w-72 h-72 rounded-full opacity-10 blur-[100px] pointer-events-none"
                style={{ background: "var(--color-blue)" }}
            />

            <div className="relative w-full max-w-md mx-4 z-10">
                {/* Card */}
                <div
                    className="rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                    style={{
                        background: "rgba(13,13,13,0.88)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    {/* Linha azul no topo */}
                    <div
                        className="h-0.75 w-full"
                        style={{ background: "var(--color-blue)" }}
                    />

                    <div className="px-8 py-10">
                        {/* Logo */}
                        <div className="flex flex-col items-center mb-8">
                            <span
                                className="text-3xl font-black tracking-[0.2em] uppercase"
                                style={{ color: "var(--color-blue)" }}
                            >
                                <span>Nex</span>
                                <span style={{ color: "var(--color-white)" }}>
                                    Play
                                </span>
                            </span>
                            <p
                                className="mt-1 text-[11px] tracking-[0.25em] uppercase"
                                style={{ color: "var(--color-gray)" }}
                            >
                                Painel Administrativo
                            </p>
                        </div>

                        {/* Aviso de sessão expirada por inatividade */}
                        {expiredByInactivity && (
                            <Alert
                                severity="warning"
                                className="mb-5 rounded-xl text-sm"
                                sx={{
                                    backgroundColor: "rgba(251,191,36,0.08)",
                                    color: "#fde68a",
                                    border: "1px solid rgba(251,191,36,0.25)",
                                    "& .MuiAlert-icon": { color: "#fbbf24" },
                                }}
                            >
                                Sessão encerrada por{" "}
                                <strong>30 dias de inatividade</strong>. Faça
                                login novamente.
                            </Alert>
                        )}

                        {/* Erro de login */}
                        {error && (
                            <Alert
                                severity="error"
                                className="mb-5 rounded-xl text-sm"
                                sx={{
                                    backgroundColor: "rgba(220,38,38,0.1)",
                                    color: "#fca5a5",
                                    border: "1px solid rgba(220,38,38,0.25)",
                                    "& .MuiAlert-icon": { color: "#f87171" },
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        <h1
                            className="text-lg font-semibold mb-6 text-center"
                            style={{ color: "var(--color-white)" }}
                        >
                            Entrar na sua conta
                        </h1>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >
                            <TextField
                                label="E-mail"
                                type="email"
                                variant="outlined"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                sx={inputSx}
                            />

                            <TextField
                                label="Senha"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                fullWidth
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                slotProps={{
                                    input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowPassword((v) => !v)
                                            }
                                            edge="end"
                                            tabIndex={-1}
                                            sx={{ color: "var(--color-gray)" }}
                                        >
                                            {showPassword ? <HiEyeOff /> : <HiEye />}
                                        </IconButton>
                                        </InputAdornment>
                                    ),
                                    },
                                }}
                                sx={inputSx}
                            />

                            <p
                                className="text-[11px] text-center -mt-1"
                                style={{ color: "var(--color-gray)" }}
                            >
                                Sessões expiram após{" "}
                                <span style={{ color: "var(--color-blue)" }}>
                                    30 dias de inatividade.
                                </span>
                                
                            </p>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-1 w-full py-3 rounded-xl font-semibold text-sm uppercase tracking-widest transition-all duration-200"
                                style={{
                                    background: loading
                                        ? "rgba(121,196,242,0.25)"
                                        : "var(--color-blue)",
                                    color: "var(--color-black)",
                                    cursor: loading ? "not-allowed" : "pointer",
                                }}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <CircularProgress
                                            size={15}
                                            sx={{ color: "var(--color-black)" }}
                                        />
                                        Entrando...
                                    </span>
                                ) : (
                                    "Entrar"
                                )}
                            </button>
                        </form>

                        <p
                            className="mt-6 text-center text-xs"
                            style={{ color: "var(--color-gray)" }}
                        >
                            Problemas de acesso?{" "}
                            <a
                                href="mailto:suporte@nexplay.com.br"
                                className="underline"
                                style={{ color: "var(--color-blue)" }}
                            >
                                Contate o suporte
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

const inputSx = {
    "& .MuiOutlinedInput-root": {
        color: "var(--color-white)",
        borderRadius: "10px",
        "& fieldset": { borderColor: "rgba(140,140,140,0.3)" },
        "&:hover fieldset": { borderColor: "var(--color-blue)" },
        "&.Mui-focused fieldset": { borderColor: "var(--color-blue)" },
    },
    "& .MuiInputLabel-root": {
        color: "var(--color-gray)",
        "&.Mui-focused": { color: "var(--color-blue)" },
    },
    "& .MuiInputBase-input": { caretColor: "var(--color-blue)" },
};

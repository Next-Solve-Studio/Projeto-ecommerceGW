"use client";

import { useState, useEffect, useRef } from "react";
import {
    FiMessageSquare,
    FiX,
    FiCornerDownLeft,
} from "react-icons/fi";

type Option = {
    text: string;
    nextNodeId: string;
};

type ChatNode = {
    id: string;
    text: string;
    options: Option[];
};

type Message = {
    id: string;
    sender: "bot" | "user";
    text: string;
};

const chatScript: Record<string, ChatNode> = {
    start: {
        id: "start",
        text: "Olá! Sou o assistente virtual da Flowfun Suplementos. Qual é o seu principal objetivo físico hoje?",
        options: [
            {
                text: "Ganhar Massa Muscular (Hipertrofia)",
                nextNodeId: "massa",
            },
            {
                text: "Emagrecimento / Definição",
                nextNodeId: "emagrecimento",
            },
            {
                text: "Melhorar Energia e Foco nos treinos",
                nextNodeId: "energia",
            },
        ],
    },

    massa: {
        id: "massa",
        text: "Excelente escolha! Para hipertrofia, a base da suplementação é o superávit calórico e síntese proteica. Qual o seu maior desafio?",
        options: [
            {
                text: "Não consigo bater as proteínas diárias",
                nextNodeId: "whey",
            },
            {
                text: "Falta de força/explosão no treino",
                nextNodeId: "creatina",
            },
            {
                text: "Voltar ao menu inicial",
                nextNodeId: "start",
            },
        ],
    },

    emagrecimento: {
        id: "emagrecimento",
        text: "Para definição, precisamos acelerar o metabolismo e controlar o apetite. O que você busca mais?",
        options: [
            {
                text: "Queimar gordura mais rápido",
                nextNodeId: "termogenico",
            },
            {
                text: "Evitar a perda de massa magra",
                nextNodeId: "whey_emagrecer",
            },
            {
                text: "Voltar ao menu",
                nextNodeId: "start",
            },
        ],
    },

    energia: {
        id: "energia",
        text: "Foco e energia mudam o jogo. Recomendo dar uma olhada em Pré-treinos com cafeína, beta-alanina e taurina.",
        options: [
            {
                text: "Entendi, obrigado!",
                nextNodeId: "final",
            },
            {
                text: "Voltar ao início",
                nextNodeId: "start",
            },
        ],
    },

    whey: {
        id: "whey",
        text: "O Whey Protein é ideal para reconstrução muscular pós-treino.",
        options: [
            {
                text: "Ver outra dúvida",
                nextNodeId: "start",
            },
        ],
    },

    creatina: {
        id: "creatina",
        text: "A Creatina aumenta força, carga e desempenho muscular.",
        options: [
            {
                text: "Ver outra dúvida",
                nextNodeId: "start",
            },
        ],
    },

    termogenico: {
        id: "termogenico",
        text: "Termogênicos ajudam no gasto calórico e disposição.",
        options: [
            {
                text: "Ver outra dúvida",
                nextNodeId: "start",
            },
        ],
    },

    whey_emagrecer: {
        id: "whey_emagrecer",
        text: "Manter proteína alta ajuda a preservar massa magra durante o déficit calórico.",
        options: [
            {
                text: "Ver outra dúvida",
                nextNodeId: "start",
            },
        ],
    },

    final: {
        id: "final",
        text: "Disponha! Se precisar de algo mais, basta clicar abaixo.",
        options: [
            {
                text: "Reiniciar Chat",
                nextNodeId: "start",
            },
        ],
    },
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentNode, setCurrentNode] =
        useState<ChatNode>(chatScript.start);
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: "init",
                    sender: "bot",
                    text: chatScript.start.text,
                },
            ]);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, isTyping]);

    const handleOptionClick = (option: Option) => {
        setMessages((prev) => [
            ...prev,
            {
                id: String(Date.now()),
                sender: "user",
                text: option.text,
            },
        ]);

        setIsTyping(true);

        setTimeout(() => {
            const nextNode =
                chatScript[option.nextNodeId] ??
                chatScript.start;

            setCurrentNode(nextNode);

            setMessages((prev) => [
                ...prev,
                {
                    id: String(Date.now() + 1),
                    sender: "bot",
                    text: nextNode.text,
                },
            ]);

            setIsTyping(false);
        }, 800);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className="flex items-center justify-center w-14 h-14 bg-yellow-600 hover:bg-yellow-500 text-white rounded-full shadow-lg transition">
                    <FiMessageSquare size={24} />
                </button>
            )}

            {isOpen && (
                <div className="w-90 h-125 bg-[#050505] rounded-2xl flex flex-col overflow-hidden">

                    <div className="p-4 border-b border-white/10 flex justify-between">
                        <h3 className="text-white">Dúvidas Rápidas</h3>

                        <button onClick={() => setIsOpen(false)}><FiX /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${msg.sender === "user"
                                        ? "bg-yellow-600 text-white rounded-tr-none"
                                        : "bg-zinc-900 text-zinc-100 border border-white/5 rounded-tl-none"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex">
                                <div className="bg-zinc-900 text-zinc-400 border border-white/5 rounded-2xl p-3">
                                    Digitando...
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-white/10">

                        {isTyping ? (
                            <p className="text-xs text-center text-zinc-500 italic">Aguardando resposta...</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {currentNode.options.map(
                                    (option, idx) => (
                                        <button key={idx} onClick={() => handleOptionClick(option)} className="w-full flex items-center gap-2 rounded-xl bg-zinc-900 text-zinc-200 hover:text-white border border-white/10 hover:border-yellow-500 px-3 py-2 text-xs transition-all">
                                            
                                            <FiCornerDownLeft size={12} />

                                            <span>{option.text}</span>
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
"use client";
import { useEffect, useRef, useState } from "react";
import { FiMessageSquare, FiX, FiCornerDownLeft } from "react-icons/fi";

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

const createMessage = (sender: Message["sender"], text: string): Message => ({
    id: crypto.randomUUID(),
    sender,
    text,
});

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

    const [messages, setMessages] = useState<Message[]>([
        createMessage("bot", chatScript.start.text),
    ]);

    const [currentNode, setCurrentNode] = useState<ChatNode>(chatScript.start);

    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleOptionClick = (option: Option) => {
        if (isTyping) return;

        setMessages((prev) => [...prev, createMessage("user", option.text)]);

        setIsTyping(true);

        timeoutRef.current = setTimeout(() => {
            const nextNode = chatScript[option.nextNodeId] ?? chatScript.start;

            setCurrentNode(nextNode);

            setMessages((prev) => [
                ...prev,
                createMessage("bot", nextNode.text),
            ]);

            setIsTyping(false);
        }, 800);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {!isOpen && (
                <button type="button" onClick={() => setIsOpen(true)} className="w-14 h-14 rounded-full bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg flex items-center justify-center">
                    <FiMessageSquare size={24} />
                </button>
            )}

            {isOpen && (
                <div className="w-90 h-125 bg-[#050505] rounded-2xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-white font-medium">Dúvidas Rápidas</h3>

                        <button type="button" onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                            <FiX size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.sender === "user" ? "bg-yellow-600 text-white" : "bg-zinc-900 text-zinc-100 border border-white/5"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="text-zinc-500 text-sm">Digitando...</div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-white/10">
                        {!isTyping && (
                            <div className="flex flex-col gap-2">
                                {currentNode.options.map((option) => (
                                    <button type="button" key={option.text} onClick={() => handleOptionClick(option)}
                                        className="w-full flex items-center gap-2 rounded-xl bg-zinc-900 hover:border-yellow-500 border border-white/10 px-3 py-2 text-xs text-zinc-100 transition-colors">
                                        <FiCornerDownLeft size={14} className="text-yellow-500 shrink-0" />
                                        {option.text}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

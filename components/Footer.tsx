"use client"

import Link from "next/link"
import { Package, Github, Instagram, Mail } from "lucide-react"
import { useUser } from "@clerk/nextjs"

export default function Footer() {
    const { isSignedIn } = useUser()

    const dashboardHref = isSignedIn ? "/dashboard" : "/sign-in"
    const resourcesHref = isSignedIn ? "/resources" : "/sign-in"
    const requestsHref = isSignedIn ? "/dashboard/requests" : "/sign-in"

    return (
        <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <Package className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-lg">CommunityShare</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Share resources with your community. Borrow what you need, lend what you have.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href={dashboardHref} className="hover:text-foreground transition-colors">
                                    Dashboard {!isSignedIn && <span className="text-xs text-primary">(Sign in)</span>}
                                </Link>
                            </li>
                            <li>
                                <Link href={resourcesHref} className="hover:text-foreground transition-colors">
                                    Browse Resources {!isSignedIn && <span className="text-xs text-primary">(Sign in)</span>}
                                </Link>
                            </li>
                            <li>
                                <Link href={requestsHref} className="hover:text-foreground transition-colors">
                                    Borrow Requests {!isSignedIn && <span className="text-xs text-primary">(Sign in)</span>}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-sm mb-3">Get in Touch</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/contact" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5" /> Contact Developer
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/TheAnsumanAJ"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-foreground transition-colors flex items-center gap-1.5"
                                >
                                    <Github className="w-3.5 h-3.5" /> GitHub
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.instagram.com/ansuman._.aj?igsh=MW53ZnUzcWU5cDN1ZQ=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-foreground transition-colors flex items-center gap-1.5"
                                >
                                    <Instagram className="w-3.5 h-3.5" /> Instagram
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} CommunityShare. All rights reserved.
                    </p>
                    <p className="text-sm">
                        Made with Love<span className="text-green-500">💚</span> by <span className="font-semibold text-primary">@AJ</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}

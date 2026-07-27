<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { dashboard, login } from '@/routes';
import { register } from '@/routes';
</script>

<template>
    <Head title="Welcome">
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
    </Head>
    <div
        class="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 to-cyan-50 p-6 text-slate-900 lg:justify-center lg:p-8 dark:from-blue-950 dark:to-slate-900 dark:text-slate-100"
    >
        <header
            class="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl"
        >
            <nav class="flex items-center justify-end gap-4">
                <Link
                    v-if="$page.props.auth.user"
                    :href="dashboard()"
                    class="inline-block rounded-md border border-blue-200 px-5 py-1.5 text-sm leading-normal text-slate-900 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-800 dark:text-slate-100 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
                >
                    Dashboard
                </Link>
                <template v-else>
                    <Link
                        :href="login()"
                        class="inline-block rounded-md border border-transparent px-5 py-1.5 text-sm leading-normal text-slate-900 hover:border-blue-200 hover:bg-blue-50/50 dark:text-slate-100 dark:hover:border-blue-800 dark:hover:bg-blue-900/10"
                    >
                        Log in
                    </Link>
                    <Link
                        :href="register()"
                        class="inline-block rounded-md border border-blue-200 px-5 py-1.5 text-sm leading-normal text-slate-900 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-800 dark:text-slate-100 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
                    >
                        Register
                    </Link>
                </template>
            </nav>
        </header>
        <div
            class="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0"
        >
            <main
                class="flex w-full max-w-[335px] flex-col-reverse overflow-hidden rounded-lg lg:max-w-4xl lg:flex-row"
            >
                <div
                    class="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(30,58,138,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-slate-800 dark:text-slate-100 dark:shadow-[inset_0px_0px_0px_1px_rgba(59,130,246,0.2)]"
                >
                    <h1 class="mb-1 font-medium text-blue-900 dark:text-blue-100">Welcome to Carmel Water Utilities</h1>
                    <p class="mb-2 text-slate-600 dark:text-slate-400">
                        A modern management system for water utilities. <br />Get started by exploring your dashboard.
                    </p>
                    <ul class="mb-4 flex flex-col gap-3 lg:mb-6">
                        <li class="flex items-start gap-3">
                            <div class="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                <svg class="h-3 w-3 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <span>Access your water utility dashboard</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <div class="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                <svg class="h-3 w-3 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <span>Manage water resources and billing</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <div class="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                <svg class="h-3 w-3 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <span>Monitor system performance and analytics</span>
                        </li>
                    </ul>
                    <div class="flex gap-3 text-sm leading-normal">
                        <Link
                            v-if="$page.props.auth.user"
                            :href="dashboard()"
                            class="inline-block rounded-md border border-blue-600 bg-blue-600 px-5 py-2 text-sm leading-normal text-white hover:border-blue-700 hover:bg-blue-700 dark:hover:border-blue-500 dark:hover:bg-blue-500"
                        >
                            Go to Dashboard
                        </Link>
                        <template v-else>
                            <Link
                                :href="login()"
                                class="inline-block rounded-md border border-blue-600 bg-blue-600 px-5 py-2 text-sm leading-normal text-white hover:border-blue-700 hover:bg-blue-700 dark:hover:border-blue-500 dark:hover:bg-blue-500"
                            >
                                Log In
                            </Link>
                        </template>
                    </div>
                </div>
                <div
                    class="relative -mb-px flex aspect-[335/364] w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-100 to-cyan-100 lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:from-blue-900 dark:to-slate-800"
                >
                    <div class="flex flex-col items-center justify-center space-y-4">
                        <svg class="h-24 w-24 text-blue-600 dark:text-blue-300 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                        </svg>
                        <h2 class="text-2xl font-semibold text-blue-900 dark:text-blue-100">Water Utilities Management</h2>
                        <p class="text-center text-sm text-blue-700 dark:text-blue-200">Modern solutions for water resource management</p>
                    </div>
                    <div
                        class="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(37,99,235,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_rgba(59,130,246,0.2)]"
                    ></div>
                </div>
            </main>
        </div>
        <div class="hidden h-14.5 lg:block"></div>
    </div>
</template>

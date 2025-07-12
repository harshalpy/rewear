import Link from "next/link"
import { SignupForm } from "@/components/signup-form"


export default function SignupPage() {
    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold ">Create your account</h2>
                    <p className="mt-2 text-center text-sm">
                        Or{" "}
                        <Link href="/login" className="font-medium text-blue-600">
                            sign in to your existing account
                        </Link>
                    </p>
                </div>
                <SignupForm />
            </div>
        </div>
    )
}
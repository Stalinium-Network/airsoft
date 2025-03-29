"use client";
import RulesWaiver from "@/components/rules-waiver/RulesWaiver";
import { SvgBook } from "@/components/SVG/Book";
import { motion } from "framer-motion";

const waiver = `
# Zone 37 Airsoft, Inc.

Recreational Activities Release of Liability, Waiver of Claims, Express
Assumption of Risk and Indemnity Agreement – Zone 37 Airsoft, Inc.
THIS IS A RELEASE OF LIABILITY, WAIVER OF CLAIMS, ASSUMPTION OF RISK – 

PLEASE READ BEFORE SIGNING

I represent that I am qualified, 18 years old or older, in good health, and in proper physical condition to participate in
these activities. Express Assumption of Risk Associated with Recreation Activities:
I do hereby affirm and acknowledge that I have been fully informed and understand the inherent hazards and risks
associated with the recreational activity generally described as Airsoft Game Play, including the rental of equipment
and transportation associated therewith of which I am about to engage in. In consideration of Zone 37 Airsoft, Inc.
zfurnishing services and or equipment to enable me to participate. I do understand the activity involves risks, dangers
and the use of equipment that may result in my injury, illness, potential for permanent disability and or death. I
understand fully that this activity involves risks, bodily injury, strains, partial and or total paralysis, fractures, eye
injuries, blindness, heat stroke, heart attack, disease, death or other ailments that could cause serious disability and
or even death, which may be caused by my own actions or inaction, those of others participating in this recreational
activity known as Airsoft Game Play, the condition in which the event takes place, and or the negligence of the
owners, agents, employees, officers, directors, stockholders of Zone 37 Airsoft, Inc.; accidents, breach of contract,
force of nature or any other causes, and the negligence of others. I fully accept and assume all such risk and all
responsibility for losses, costs, and damages I may incur as a result of my participation in this activity. I hold harmless
Zone 37 Airsoft Inc. for any such claim, release from any loss, liability, damages, or cost which any may incur as the
result of such claim. Release of liability, Waiver of Claims.
I HEREBY RELEASE AND HOLD HARMLESS WITH RESPECT TO ANY AND ALL INJURY, DISABILITY, DEATH,
OR LOSS OR DAMAGE TO PERSON OR PROPERTY, WHETHER CAUSED BY NEGLIGENCE OR OTHERWISE,
THE FOLLOWING NAMED PERSONS OR ENTITIES, HEREIN REFERRED TO AS RELEASES: Zone 37 Airsoft,
Inc., officers, employees, agents, stockholders, owners, representatives, and volunteers, from liability and
responsibility whatsoever and for any claims or causes of action that I, my estate, heirs, survivors, executors, or
assigns may have for personal injury, property damage, or wrongful death arising from the above activities weather
caused by active or passive negligence of the release or otherwise. By executing this document, I agree to hold the
releases as listed above harmless and identify there in conjunction with any injury, disability, death, or loss or damage
to person or property that may occur as a result of engaging in the above activity known as Airsoft Game Play.
This release shall be binding to the fullest extent permitted by law. If any provision of this release is found to be
unenforceable, the remaining terms and release shall be enforced.
I have read this release and waiver of liability, waiver of claims, indemnity agreement and assumption of risk,
understand that I have given up substantial rights by signing it and have signed in freely and without any inducement
and assurance of any kind and intend it be a complete and unconditional release of all liability to the greatest extent
allowed by law. By signing below, I agree to be bound by this agreement:

`

export default function WaiverPage() {
    return (
        <div className="flex flex-col items-center">
            <RulesWaiver markdown={waiver} CustomComponent={Title} />

            <div className="w-full max-w-4xl px-4 py-10 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="bg-gray-800 rounded-xl p-8 shadow-2xl border border-green-500/20 w-full max-w-2xl"
                >
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-white">To sign the document</h3>
                        <p className="text-gray-300 mt-2">Download the PDF version for signing</p>
                    </div>

                    <motion.a
                        href="https://drive.usercontent.google.com/u/0/uc?id=1wM-C8GEYAa--1DO_dWInKzOTC1ouJqt1&export=download"
                        download
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-4 px-8 rounded-lg w-full transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download the PDF file
                    </motion.a>
                </motion.div>
            </div>
        </div>
    );
}

const Title = () => {
    return (
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center border-b border-green-500 pb-4">
            Waiver
        </h1>
    );
}
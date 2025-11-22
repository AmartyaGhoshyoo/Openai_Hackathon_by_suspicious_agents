'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .min(7, 'Phone number is required')
    .regex(/^\+?\d{7,15}$/, 'Invalid phone number'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const [submitted, setSubmitted] = useState(false)

  const onSubmit = async (data: ContactFormData) => {
    console.log('Submitted:', data)
    setSubmitted(true)
    reset()
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <motion.div
       id='contact-me'
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-[1000px] mx-auto my-10 px-4 outfit-500 flex flex-col  sm:flex-row gap-16 justify-between items-start"
    >
      <div className="text-white rounded-[12px] p-6 md:p-10 shadow-xl bg-white flex-1 w-full">
        <h2 className="text-xl font-bold mb-6  text-black"><br /> Have a doubt <span className='text-[#0a0a0a99]'>in mind?</span></h2>
        <AnimatePresence>
          {submitted && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-6 text-black text-center py-3 px-4 rounded-lg font-semibold "
            >
              🎉 Thank you! Your message has been sent.
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Name & Email Row */}
          <div className="grid grid-cols-1 gap-6">
            {/* Name */}
            <div>
              <label className="block mb-1 text-xs font-medium text-black">
                Your name*
              </label>
              <input
                {...register('name')}
                placeholder="Full name"
                className="w-full px-4 py-3 bg-[#f5f5f5] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-xs font-medium text-black">
                E-mail*
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="email@gmail.com"
                className="w-full px-4 py-3 bg-[#f5f5f5]  text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-xs font-medium text-black">
              Phone Numbe*
            </label>
            <input
              {...register('phone')}
              type="tel"
              placeholder="Phone number"
              className="w-full px-4 py-3 bg-[#f5f5f5] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block mb-1 text-xs font-medium text-black">
              Message
            </label>
            <textarea
              {...register('message')}
              placeholder="Type your message here..."
              className="w-full px-4 py-3 h-32 bg-[#f5f5f5]  text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-white resize-none"
            />
            {errors.message && (
              <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              disabled={isSubmitting}
              className="bg-black w-full rounded-full text-white  font-semibold py-3 px-6 shadow-md hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Send Message'}
            </motion.button>
          </div>

        </form>
      </div>
      <div className="flex-1">
        <h2 className="text-6xl sm:text-8xl font-black text-white">{"Let's Talk."}</h2>
        <p className="text-3xl font-medium text-white">Reach Out Anytime</p>
        {/* <p className="text-3xl font-medium text-white/50">{"__Whether it's a website,"}</p> */}
        <p className="text-3xl font-medium text-white/50">Share your thoughts, queries, or feature requests. We’re listening.</p>
      </div>
    </motion.div>
  )
}

export default ContactUs

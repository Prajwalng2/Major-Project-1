import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import * as z from "zod"

const userProfileSchema = z.object({
  age: z.number().min(18, { message: "Age must be at least 18." }).max(100, { message: "Age must be less than 100." }).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  category: z.string().optional(),
  income: z.number().optional(),
  annualIncome: z.number().optional(),
  occupation: z.string().optional(),
  state: z.string().optional(),
  education: z.string().optional(),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']).optional(),
  disability: z.boolean().optional(),
  landOwnership: z.boolean().optional(),
  businessType: z.string().optional(),
  employmentStatus: z.enum(['employed', 'unemployed', 'self-employed', 'student', 'retired']).optional(),
  interests: z.array(z.string()).optional(),
  bplCardHolder: z.boolean().optional(),
  farmingLand: z.number().optional(),
});

type UserProfileValues = z.infer<typeof userProfileSchema>;

const SchemeMatcherForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const form = useForm<UserProfileValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      age: undefined,
      gender: undefined,
      category: '',
      income: undefined,
      annualIncome: undefined,
      occupation: '',
      state: '',
      education: '',
      maritalStatus: undefined,
      disability: false,
      landOwnership: false,
      businessType: '',
      employmentStatus: undefined,
      interests: [],
      bplCardHolder: false,
      farmingLand: undefined,
    },
    mode: "onChange",
  });

  const { control, handleSubmit, watch, formState: { isValid } } = form;

  const age = watch("age");
  const gender = watch("gender");
  const category = watch("category");
  const income = watch("income");
  const annualIncome = watch("annualIncome");
  const occupation = watch("occupation");
  const state = watch("state");
  const education = watch("education");
  const maritalStatus = watch("maritalStatus");
  const disability = watch("disability");
  const landOwnership = watch("landOwnership");
  const businessType = watch("businessType");
  const employmentStatus = watch("employmentStatus");
  const interests = watch("interests");
  const bplCardHolder = watch("bplCardHolder");
  const farmingLand = watch("farmingLand");

  const steps = [
    {
      id: 'basic',
      label: 'Basic Information',
      description: 'Tell us a bit about yourself.',
      fields: ['age', 'gender', 'category', 'income', 'annualIncome', 'occupation', 'state'],
    },
    {
      id: 'personal',
      label: 'Personal Details',
      description: 'More about your background.',
      fields: ['education', 'maritalStatus', 'disability', 'landOwnership', 'businessType'],
    },
    {
      id: 'employment',
      label: 'Employment & Interests',
      description: 'Your work and hobbies.',
      fields: ['employmentStatus', 'interests', 'bplCardHolder', 'farmingLand'],
    },
  ];

  const onSubmit = (data: UserProfileValues) => {
    console.log("Form submitted with data:", data);
    sessionStorage.setItem("schemeMatcherData", JSON.stringify(data));
    navigate("/scheme-matcher-results", { state: { formData: data } });
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const isNextButtonDisabled = currentStep < steps.length - 1 && !isValid;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {currentStep < steps.length ? (
        <>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-scheme-primary">
                Find Your Perfect Government Scheme
              </h2>
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-scheme-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <FormField
                  control={control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter your age" {...field} />
                      </FormControl>
                      <FormDescription>
                        Providing your age helps us find age-specific schemes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Specifying your gender helps us find gender-specific schemes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your category" {...field} />
                      </FormControl>
                      <FormDescription>
                        Entering your category helps us find category-specific schemes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Income (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter your annual income" {...field} />
                      </FormControl>
                      <FormDescription>
                        Providing your income helps us find income-specific schemes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your occupation" {...field} />
                      </FormControl>
                      <FormDescription>
                        Entering your occupation helps us find occupation-specific schemes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your state" {...field} />
                      </FormControl>
                      <FormDescription>
                        Entering your state helps us find state-specific schemes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <FormField
                  control={control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your education" {...field} />
                      </FormControl>
                      <FormDescription>
                        Entering your education helps us find education-specific schemes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Specifying your marital status helps us find schemes that match your status.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="disability"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Do you have any disabilities? (Optional)</FormLabel>
                        <FormDescription>
                          Checking this helps us find disability-specific schemes.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="landOwnership"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Do you own land? (Optional)</FormLabel>
                        <FormDescription>
                          Checking this helps us find land-ownership-specific schemes.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your business type" {...field} />
                      </FormControl>
                      <FormDescription>
                        Entering your business type helps us find business-specific schemes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <FormField
                  control={control}
                  name="employmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Status (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                          <SelectItem value="self-employed">Self-Employed</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Specifying your employment status helps us find schemes that match your status.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your interests (comma-separated)" {...field} />
                      </FormControl>
                      <FormDescription>
                        Entering your interests helps us find schemes that match your interests.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="bplCardHolder"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Do you have a BPL card? (Optional)</FormLabel>
                        <FormDescription>
                          Checking this helps us find BPL-specific schemes.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="farmingLand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farming Land (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter your farming land" {...field} />
                      </FormControl>
                      <FormDescription>
                        Providing your farming land helps us find farming-specific schemes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}

            <div className="flex justify-between">
              {currentStep > 0 && (
                <Button variant="secondary" onClick={handlePrev}>
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button disabled={isNextButtonDisabled} onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={!isValid}>
                  Find Schemes
                </Button>
              )}
            </div>
          </form>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            You're all set!
          </h2>
          <p className="text-gray-600 mb-6">
            Click the button below to find the schemes that match your profile.
          </p>
          <Button type="button" onClick={handleSubmit(onSubmit)}>
            Find Schemes
          </Button>
        </div>
      )}
    </div>
  );
};

export default SchemeMatcherForm;

export interface EdenNotebookEntry {
  id: string;
  title: string;
  date: string;
  whatIdidLastWorkday: string;
  whatIWillDoToday: string;
  blockers: string;
  notes?: string;
  rawContent?: string;
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_EDEN_NOTEBOOK_ENTRIES: EdenNotebookEntry[] = [
  {
    id: "eden-task-2026-09-26",
    title: "TASK 9-26-26",
    date: "2026-09-26",
    whatIdidLastWorkday: "Finalized build of the AI VA",
    whatIWillDoToday: "Maker QA",
    blockers: "None",
    notes: "",
    rawContent: `TASK 9-26-26\nWhat I did last workday:\nFinalized build of the AI VA \nWhat I will do today:\nMaker QA\n\nBlockers/Urgent Concerns/Other Concerns:\nNone`,
    createdAt: "2026-09-26T09:00:00.000Z",
    updatedAt: "2026-09-26T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-25",
    title: "TASK 9-25-26",
    date: "2026-09-25",
    whatIdidLastWorkday:
      "Presented the AI-VA Reference Product\nWorked on new features addition of AI-VA",
    whatIWillDoToday:
      "Finalized build of AI-VA Reference Product before recording\nQA Migration to new template",
    blockers: "None",
    notes: "",
    rawContent: `TASK 9-25-26\nWhat I did last workday:\nPresented the AI-VA Reference Product\nWorked on new features addition of AI-VA\nWhat I will do today:\nFinalized build of AI-VA Reference Product before recording\nQA Migration to new template\nBlockers/Urgent Concerns/Other Concerns:\nNone`,
    createdAt: "2026-09-25T09:00:00.000Z",
    updatedAt: "2026-09-25T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-24",
    title: "TASKS 9-24-26",
    date: "2026-09-24",
    whatIdidLastWorkday: "Presentation",
    whatIWillDoToday: "AI VA Reference Product build to be prepared on the presentation",
    blockers: "None",
    notes: "",
    rawContent: `TASKS 9-24-26\nWhat I did last work day:\nPresentation  \nWhat I’ll do today:\nAI VA Reference Product build to be prepared on the presentation \nBlockers/Urgent Concerns/Other Concerns\nNone`,
    createdAt: "2026-09-24T09:00:00.000Z",
    updatedAt: "2026-09-24T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-23",
    title: "TASKS 9-23-26",
    date: "2026-09-23",
    whatIdidLastWorkday: "Worked on AI VA Reference Product",
    whatIWillDoToday: "AI VA Reference Product build to be prepared on the presentation",
    blockers: "None",
    notes: "",
    rawContent: `TASKS 9-23-26\nWhat I did last work day:\nWorked on AI VA Reference Product \nWhat I’ll do today:\nAI VA Reference Product build to be prepared on the presentation \nBlockers/Urgent Concerns/Other Concerns\nNone`,
    createdAt: "2026-09-23T09:00:00.000Z",
    updatedAt: "2026-09-23T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-22",
    title: "TASKS 9-22-26",
    date: "2026-09-22",
    whatIdidLastWorkday: "Worked on AI VA Reference Product",
    whatIWillDoToday:
      "Continue AI VA Reference product build replacing gcloud and cloudflare with an integration layer using composio for gmail and calendarintegration\nMigrating my Maker QA to a new cleaner more readable template",
    blockers: "None",
    notes: "",
    rawContent: `TASKS 9-22-26\nWhat I did last work day:\nWorked on AI VA Reference Product \nWhat I’ll do today:\nContinue AI VA Reference product build replacing gcloud and cloudflare with an integration layer using composio for gmail and calendarintegration\nMIgrating my Maker QA to a new cleaner more readable template\nBlockers/Urgent Concerns/Other Concerns\nNone`,
    createdAt: "2026-09-22T09:00:00.000Z",
    updatedAt: "2026-09-22T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-21",
    title: "TASKS 9-21-26",
    date: "2026-09-21",
    whatIdidLastWorkday: "Started the build for AI VA Reference Product",
    whatIWillDoToday: "Meeting and status update for the AI VA Reference Product",
    blockers: "None",
    notes:
      "Improvements on AI VA:\n• Use cloudflare for cron jobs for job processing or queueing as vercel cron execution is only once per day\n• Use gemini free api key or other inference provider",
    rawContent: `TASKS 9-21-26\nWhat I did last work day:\nStarted the build for AI VA Reference Product\nWhat I’ll do today:\nMeeting and status update for the AI VA Reference Product\nBlockers/Urgent Concerns/Other Concerns\nNone\nImprovements on AI VA\nUse cloudflare for cron jobs for job processing or queueing as vercel cron execution is only once per day \nUse gemini free api key or other inference provider`,
    createdAt: "2026-09-21T09:00:00.000Z",
    updatedAt: "2026-09-21T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-18",
    title: "TASKS 9-18-26",
    date: "2026-09-18",
    whatIdidLastWorkday:
      "Scraped data from different sources for knowledge base for the biggest and different pain points of VAs and content creators for problems.\nMaker QA validation",
    whatIWillDoToday:
      "From automatic to manual testing on maker qa adding human in the loop\nMeeting for apex human new category with ms jamie",
    blockers: "None",
    notes:
      "Actual results versioning\nPrioritize for generalized\nNext: Scope of testing ask devs\nSend documents to ms jamie\nThursday EOD Friday morning done\nAI VA Reference Product:\n- Where template\n- sitemap\n- userjourney\n- ERD\n- Then Build",
    rawContent: `TASKS 9-18-26\nWhat I did last work day:\nScraped data from different sources for knowledge base for the biggest and different pain points of VAs and content creators for problems.\nMaker QA validation  \nWhat I’ll do today:\nFrom automatic to manual testing on maker qa adding human in the loop\nMeeting for apex human new category with ms jamie\nBlockers/Urgent Concerns/Other Concerns\nNone\nActual results versioning \nPrioritize for generalized \nNext\nScope of testing ask devs\n\nSend documents to ms jamie \nThursday EOD Friday morning done\nAI VA Reference Product\nWhere template \nsitemap\nuserjourney\nERD\nThen Build`,
    createdAt: "2026-09-18T09:00:00.000Z",
    updatedAt: "2026-09-18T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-17",
    title: "TASKS 9-17-26",
    date: "2026-09-17",
    whatIdidLastWorkday:
      "Updated issues status with lelstat on Maker and improving automation of qa\nInitial plan and for Apex human reference product",
    whatIWillDoToday:
      "Continue improving of automation of qa and updating maker docs\nResearching apex human reference product",
    blockers: "None",
    notes: "",
    rawContent: `TASKS 9-17-26\nWhat I did last work day:\nUpdated issues status with lelstat on Maker and improving automation of qa \nInitial plan and for Apex human reference product\nWhat I’ll do today:\nContinue improving of automation of qa and updating maker docs\nResearching apex human reference product \nBlockers/Urgent Concerns/Other Concerns\nNone`,
    createdAt: "2026-09-17T09:00:00.000Z",
    updatedAt: "2026-09-17T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-15",
    title: "TASKS 9-15-26",
    date: "2026-09-15",
    whatIdidLastWorkday: "QA Maker verification and SSOT consolidation across test cases",
    whatIWillDoToday:
      "Onboarded eden collaborators github projects with meeting from sir cle\nAsk if he needs help (refer my organization structure)\nMigrates QA Maker to github project\nInvitation from sir cle\nQA will provide tickets to devs / Devs will input the tickets, QA moves, Backlogs, Human readable, Separate by sheets different pages and features\nApex Human meeting new framework\nPMsuite: https://github.com/ED3N-Ventures-Interns/pmsuite\nCompetitor Analysis: https://x.com/vibemarketer_/status/2089706595517366692\nWait Apex human get from ms jamie: Framework, Brief Template, Reference Product catalogue",
    blockers: "None",
    notes: "• Got my eden id and id lace, thank you ms michelle\n• Ate a lot of fish fillet",
    rawContent: `TASKS 9-15-26\nOnboarded eden collaborators github projects with meeting from sir cle\nAsk if he needs help (refer my organization structure)\nMigrates QA Maker to github project\nInvitation from sir cle\nQA will provide tickets to devsDevs will input the tickets\nQA moves\nBacklogs \nHuman readable\nSeperate by sheets different pages and features \nApex Human meeting new framework\nPMsuite \nhttps://github.com/ED3N-Ventures-Interns/pmsuite\nCompetitor Analysis https://x.com/vibemarketer_/status/2089706595517366692\nWait Apex human get from ms jamie:\nFramework \nBrief Template\nReference Product catalogue\nGot my eden id and id lace, thank you ms michelle\nAte a lot of fish fillet`,
    createdAt: "2026-09-15T09:00:00.000Z",
    updatedAt: "2026-09-15T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-14",
    title: "TASKS 9-14-26",
    date: "2026-09-14",
    whatIdidLastWorkday: "Ongoing - QA Maker Website",
    whatIWillDoToday:
      "Ongoing - QA Maker Website\nAdded to QA Central and informed sir cle\nMoved maker qa file to QA Test cases for one ssot\nChecked and verified 7 newly passed status of the qa of maker",
    blockers: "None",
    notes: "",
    rawContent: `TASKS 9-14-26\nOngoing- QA Maker Website\nAdded to QA Central and informed sir cle for the \nMoved maker qa file to QA Test cases for one ssot\nChecked and verified 7 newly passed status of the qa of maker`,
    createdAt: "2026-09-14T09:00:00.000Z",
    updatedAt: "2026-09-14T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-11",
    title: "TASKS 9-11-26",
    date: "2026-09-11",
    whatIdidLastWorkday: "Meralco Dev assistance & updates",
    whatIWillDoToday: "Ongoing - QA Maker Website",
    blockers: "None",
    notes: "",
    rawContent: `TASKS 9-11-26\nOngoing- QA Maker Website`,
    createdAt: "2026-09-11T09:00:00.000Z",
    updatedAt: "2026-09-11T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-08",
    title: "TASKS 9-8-26",
    date: "2026-09-08",
    whatIdidLastWorkday:
      "● Assessment and examination management DONE\n● Digital certificate generation DONE",
    whatIWillDoToday:
      "ONGOING Meralco Dev Help https://github.com/ED3N-Ventures/meralco-registrar (Deadline Wednesday)\n• Familiarize with the REPO and setup locally\n• Wait for ms jamie requirements then help\n• Ask ai free gemini api key\n• Implement System administration and user management ONGOING\n• Classroom and training room scheduling/management QA\n• Workflow automation (Optional) TO DO\n\nONGOING - Scraping and PRDer grill itself Pmsuite REFPROD from jerico (Monday)\n• To put on the eden gh org commits\n• Google calendar connection\n• Scraped and PRD and grilled\n• Simplify login and registration via code\n• Remove dashboard consolidate to one\n• Step by step thing\n• Dump Ideas\n• Meta Prompt",
    blockers: "None",
    notes: "",
    rawContent: `TASKS 9-8-26\nONGOING Meralco Dev Help https://github.com/ED3N-Ventures/meralco-registrar\nDeadline Wednesday\nFamilarize with the REPO and setup locally\nwait for ms jamie requirements then help, \nAsk ai free gemini api key\nImplement System administration and user management ONGOING\n● Classroom and training room scheduling/management QA\n● Assessment and examination management DONE\n● Digital certificate generation DONE\n● Workflow automation (Optional) TO DO \n\nONGOING - Scraping and PRDer grill itself Pmsuite REFPROD from jerico - Monday\nTo put on the eden gh org commits\nGoogle calendar connection\nScraped and PRD and grilled \nSimplify login and registration via code\nRemove dashboard consolidate to one\nStep by step thing\nDump Ideas\nMeta Prompt`,
    createdAt: "2026-09-08T09:00:00.000Z",
    updatedAt: "2026-09-08T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-07",
    title: "TASKS 9-7-26",
    date: "2026-09-07",
    whatIdidLastWorkday: "Meralco repo local setup progress & Playwright test harness verification",
    whatIWillDoToday:
      "ONGOING Meralco Dev Help https://github.com/ED3N-Ventures/meralco-registrar (Deadline Tuesday)\n• Familiarize with the REPO and setup locally\n• Thursday presentation, help on dev monday tuesday\n• Wait for ms jamie requirements then help\n• Clyde will qa on wednesday\n\nONGOING - Scraping and PRDer grill itself Pmsuite REFPROD from jerico (Monday)\n• To put on the eden gh org commits\n• Google calendar connection\n• Scraped and PRD and grilled\n• Simplify login and registration via code\n• Remove dashboard consolidate to one\n• Step by step thing\n• Dump Ideas\n• Meta Prompt\n\nTODO Inform SIRJM about internship training roadmap",
    blockers: "None",
    notes: "Inform SIRJM about internship training roadmap",
    rawContent: `TASKS 9-7-26\nONGOING Meralco Dev Help https://github.com/ED3N-Ventures/meralco-registrar\nDeadline Tuesday\nFamilarize with the REPO and setup locally\nthursday presentation, help on dev monday tuesday\nwait for ms jamie requirements then help, \nclyde will qa on wednesday\nONGOING - Scraping and PRDer grill itself Pmsuite REFPROD from jerico - Monday\nTo put on the eden gh org commits\nGoogle calendar connection\nScraped and PRD and grilled \nSimplify login and registration via code\nRemove dashboard consolidate to one\nStep by step thing\nDump Ideas\nMeta Prompt\nTODO Inform SIRJM about internship training roadmap`,
    createdAt: "2026-09-07T09:00:00.000Z",
    updatedAt: "2026-09-07T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-04",
    title: "TASKS 9-4-26",
    date: "2026-09-04",
    whatIdidLastWorkday:
      "DONE - QA Maker Website (Provide Link, Steps to reproduce manual verified, Automatic QA testing logged in via google, Use Excel format for bugslist from donita, QA provided on driver + move folders as context)\nDONE QA Apex Website QA (Wait for jerico revisions as there is one yesterday then qa again after new changes)\nDONE SIRJM Setup Playwright headfull setup harness that uses specific chrome profile on specific website and also transfers token from one profile to another",
    whatIWillDoToday:
      "ONGOING - Scraping and PRDer grill itself Pmsuite REFPROD from jerico - Monday (To put on eden gh org commits, Google calendar connection, Scraped and PRD and grilled, Simplify login/registration via code, Remove dashboard consolidate to one, Step by step thing, Dump Ideas, Meta Prompt)\nSTOPPED REFPROD create competitor analysis command center new reference products competitor analysis command center (Validated and QA)\nONGOING Meralco Dev Help https://github.com/ED3N-Ventures/meralco-registrar (Familiarize with REPO and setup locally, thursday presentation, help on dev monday tuesday, wait for ms jamie requirements, clyde will qa on wednesday)\nQA Focus only for now on UI fixes and functionality testing if the flow is correct",
    blockers:
      "Subagents not allowed on the api based token so i fixed via using tmux as subagent instead",
    notes: "",
    rawContent: `TASKS 9-4-26\nDONE- QA Maker Website\nProvide Link\nSteps to reproduce (must be manual verified)\nAutomatic QA testing with logged in via google\nUse Excel format for bugslist from donita \nQA to provided on the driver + move folders as context\nDONE QA  Apex Website QA \nWait for jerico revisions as there is one yesterday then qa again after new changes\nONGOING - Scraping and PRDer grill itself Pmsuite REFPROD from jerico - Monday\nTo put on the eden gh org commits\nGoogle calendar connection\nScraped and PRD and grilled \nSimplify login and registration via code\nRemove dashboard consolidate to one\nStep by step thing\nDump Ideas\nMeta Prompt\nSTOPPED REFPROD create competitor analysis command center new reference products competitor analysis command center\nValidated and QA\nONGOING Meralco Dev Help https://github.com/ED3N-Ventures/meralco-registrar\nFamilarize with the REPO and setup locally\nthursday presentation, help on dev monday tuesday\nwait for ms jamie requirements then help, \nclyde will qa on wednesday\nDONE SIRJM Setup Playwright headfull setup harness that uses specific chrome profile on specific website and also transfers token from one profile to another\nQA Focus only for now on UI fixes and functioanility testing if the flow is correct \n\tBlockers\n\tSubagents not allowed on the api based token so i fixed via using tmux as subagent instead`,
    createdAt: "2026-09-04T09:00:00.000Z",
    updatedAt: "2026-09-04T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-03",
    title: "TASKS 9-3-26",
    date: "2026-09-03",
    whatIdidLastWorkday:
      "DONE Apex Website QA\nDONE REFPROD RECORDING: Recording meralco registrar qa the provided md files to claude code. verify if everything works make no mistakes. when goods then screen record\nRecording uploading\nDONE Like Apex human and Internly like and reviews\nValidated and QA",
    whatIWillDoToday:
      "ONGOING Pmsuite REFPROD from jerico:\n• Google calendar connection\n• Simplify login and registration via code\n• Remove dashboard consolidate to one\n• Step by step thing\n• Dump Ideas\n• Meta Prompt\n\nONGOING - QA Maker Website:\n• Provide Link\n• Automatic QA testing with logged in via google\n\nSTOPPED REFPROD create competitor analysis command center new reference products competitor analysis command center\nQA - no native database setup if on github website",
    blockers:
      "Jackal setup but solved with tmux based subagents\nNew skills QA automation manually also driven assigned to subagents\nSetup sync skills",
    notes: "",
    rawContent: `TASKS 9-3-26\nDONE Apex Website QA \nDONE  REFPROD RECORDING Recording meralco registrar qa the provided md files to claude code. verify if everything works make no mistakes. when goods then screen record\nRecording uploading\nQA - no native database setup if on github website \nDONE Like Apex human and Internly like and reviews\nSTOPPED REFPROD create competitor analysis command center new reference products competitor analysis command center\nValidated and QA\nONGOING Pmsuite REFPROD from jerico \nGoogle calendar conenction\nSimplify login and registration via code\nRemove dashboard consolidate to one\nStep by step thing\nDump Ideas\nMeta Prompt\n\nONGOING- QA Maker Website\nProvide Link\nAutomatic QA testing with logged in via google\nBLOCKERS \nJackal setup but solved with tmux based subagents \nNew skills QA automation manually also driven assigned to subagents\nSetup sync skills`,
    createdAt: "2026-09-03T09:00:00.000Z",
    updatedAt: "2026-09-03T09:00:00.000Z",
  },
  {
    id: "eden-task-2026-09-01",
    title: "TASKS 9-1-26",
    date: "2026-09-01",
    whatIdidLastWorkday:
      "Done Task #3 Kenny: on maker simple enough >1hr to do on maker commercial appeal\nDone PMSuite Onboarding\nValidated and QA",
    whatIWillDoToday:
      "Ongoing Task #1 Kenny qa the provided md files to claude code. verify if everything works make no mistakes. when goods then screen record\nStopped Task #2 Kenny: create competitor analysis command center new reference products competitor analysis command center\nOngoing- QA Maker Website: Find out\nSonnet 5 Main model\nRemove dashboard turn to analytics",
    blockers: "None",
    notes: "Ideas dump\nOrganize\nLedger\nTasks ETC",
    rawContent: `TASKS 9-1-26\nOngoing Task #1 Kenny qa the provided md files to claude code. verify if everything works make no mistakes. when goods then screen record\nStopped Task #2 Kenny:  create competitor analysis command center new reference products competitor analysis command center\nValidated and QA\nOngoing- QA Maker Website: \n\tFind out \nDone Task #3 Kenny:  on maker simple enough >1hr to do on maker commercial appeal\nDone PMSuite Onboarding \nSonnet 5 Main model \nRemove dashboard turn to analytics\nIdeas dump\nOrganize\nLedger\nTasks ETC`,
    createdAt: "2026-09-01T09:00:00.000Z",
    updatedAt: "2026-09-01T09:00:00.000Z",
  },
];

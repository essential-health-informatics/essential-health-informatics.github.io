import { MetaData, DateContainer } from "../../../pre-render/timeline-main";

export const metaData: MetaData = {
  title: "England NHS Timeline",
};

export const dateContainers: DateContainer[] = [
  {
    year: "1943",
    image_src: "/media/colossus-computer.jpg",
    alt_text: "Colossus computer",
    header: "Colossus computer",
    content:
      "The first electronic computer. Used as a codebreaker in World War II.",
    further_details: true,
  },
  {
    year: "1952",
    image_src: "/media/mcbee-punch-card.jpg",
    alt_text: "Another description",
    header: "First use of HIT",
    content:
      "Dr Arthur Rappoport uses the McBee Manual Punch Card in pathology labs.",
    further_details: false,
  },
  {
    year: "1950s",
    image_src: "/media/hand-written-table.jpg",
    alt_text: "Another description",
    header: "Computers first used for administrative purposes",
    content: "...",
    further_details: true,
  },
  {
    year: "1969",
    image_src: "/media/john-preece.jpg",
    alt_text: "Another description",
    header: "Dr John Preece and the Ottery St Mary project",
    content: "...",
  },
  {
    year: "1970s",
    image_src: "/media/emis-logo.png",
    alt_text: "Another description",
    header: "EMIS",
    content:
      "A GP in the village of Egton in Yorkshire, persuaded IBM to give him a computer and a suitable programme, built a room onto his surgery to house it and created Egton Medical Information Systems (EMIS)",
    further_details: "https://www.emishealth.com/",
  },
  {
    year: "1980s",
    image_src: "/media/read-codes.png",
    alt_text: "Another description",
    header: "Read codes",
    content:
      "Dr Read, a GP in Leicestershire, realised a dictionary of medical diagnoses was needed for his computer system and set out to create it, initially using the death certification lists described above and started with a few thousand codes.",
  },
  {
    year: "...",
    image_src: "/media/snomed-ct-logo.jpg",
    alt_text: "Another description",
    header: "SNOMED-CT",
    content:
      "Systematized Nomenclature of Medicine Clinical Terms (SNOWMED CT)",
  },
  {
    year: "1991",
    image_src: "/media/Tim Berners-Lee.jpg",
    alt_text: "Picture of Tim Berners-Lee",
    header: "World Wide Web launched",
    content:
      "In 1989, British scientist Tim Berners-Lee created the World Wide Web (WWW) while working at CERN. His intention was to develop a system that would enable automated sharing of information among scientists across universities and research institutions globally.",
  },
  {
    year: "1992",
    image_src: "/media/peter-drury.jpeg",
    alt_text: "Picture of Peter Drury",
    header: "Drury - Getting Better with Information",
    content:
      "Information will be person-based. Information should focus on health. Systems should be integrated. Information will be derived from operational systems. Information will be secure and confidential. Information will be shared across the NHS",
  },
  {
    year: "1997",
    image_src: "/media/fiona-caldicott.jpg",
    alt_text: "Another description",
    header: "Caldicott Principles of data sharing",
    content: `The first 6 (2 more came later)
Principle 1: justify the purpose(s) for using confidential information.
Principle 2: use confidential information only when it is necessary.
Principle 3: use the minimum necessary confidential information.
Principle 4: access to confidential information should be on a strict need-to-know basis.
Principle 5: everyone with access to confidential information should be aware of their responsibilities.
Principle 6: comply with the law.`,
  },
  {
    year: "2001",
    image_src: "/media/derek-wanless.jpg",
    alt_text: "Picture of Derek Wanless",
    header: "Wanless",
    content:
      "We have achieved less because we have spent very much less and not spent it well.",
  },
  {
    year: "2002",
    image_src: "/media/denis-protti.jpg",
    alt_text: "Another description",
    header: "Protti",
    content: `UK - 59% of primary care physicians
New Zealand - 52% 
USA - 17%
The original concept of the EPR being a longitudinal health record about an individual is still very valid! However, it has become entangled in organisationally bound thinking. 
A true patient-centric model is needed.`,
  },
  {
    year: "2002-2012",
    image_src: "/media/microchip-placeholder.png",
    alt_text: "Another description",
    header: "National Program for IT (NPfIT)",
    content: `Delivering 21st Century IT Support for the NHS - paper
National Program for IT (NPfIT) starts 2002
NPfIT closes down in 2012
£12.5 billion spent (167.56 billion SEK)
Very little in terms of deliveries - mainly PACS (picture archiving and communication system)`,
  },
  {
    year: "2016",
    image_src: "/media/wachter-review.png",
    alt_text:
      "Front cover of Wachter Review with net connectivity like structure",
    header: "Wachter Review, Making IT work",
    content: `10 findings, the most important:
Interoperability should be built in from the start
Health IT systems must embrace user-centred design
A successful digital strategy must be multifaceted, and requires workforce development (more to come in this afternoon’s session)
Health IT is about both technical and adaptive change`,
  },
  {
    year: "2017",
    image_src: "/media/wanna-cry.jpeg",
    alt_text: "Another description",
    header: "WannaCry NHS attack",
    content: `A Microsoft Windows Operation System exploit.
Largest hit service was England and Scotland. Wales and Northern Ireland were not affected.
Up to 70,000 devices – including computers, MRI scanners, blood-storage refrigerators and theatre equipment affected.
Some NHS services had to turn away non-critical emergencies, and some ambulances were diverted.[
In 2018 a report by Members of Parliament concluded that all 200 NHS hospitals or other organisations checked in the wake of the WannaCry attack still failed cybersecurity checks.`,
  },
  {
    year: "2019",
    image_src: "/media/topol-review-hand.jpeg",
    alt_text: "Another description",
    header: "Topol Review",
    content: `Talks about digital and genomics are the future.
The patient must be considered to be at the centre when assessing and implementing any new technologies. (I would argue staff as well)
Extensive education and training of the clinician workforce and the public, with cultivation of a cross-disciplinary approach that includes data scientists, computer scientists, engineers, bioinformaticians, in addition to the traditional mix of pharmacists, nurses and doctors.`,
  },
  {
    year: "2019",
    image_src: "/media/fci-logo.png",
    alt_text: "Another description",
    header: "Formation of the Faculty of Clinical Informatics",
    content: `The Idea of the FCI started in the 1990s inside the Royal College of GPs Health Informatics Group (RCGP HIG)
RCGP HIG gave joint representation to the Computer Group within the British Medical Association (BMA)
Academy of Colleges Information Group (ACIG, from AoMRC) tried an initial attempt to create an FCI, but National Program for IT (NPfIT) waylay this.
Prof Maureen Baker as chair of RCGP HIG set up a steering group that gave final push to start positive steps to form the FCI – April 2017
FCI formed by founding fellows November 2017 as a “spin off” faculty from the RCGP
FCI is now an independent Charitable Incorporated Organisation - September 2019`,
  },
  {
    year: "...",
    image_src: "/media/microchip-placeholder.png",
    alt_text: "Another description",
    header: "Care.data",
    content: `...`,
  },
  {
    year: "...",
    image_src: "/media/microchip-placeholder.png",
    alt_text: "Another description",
    header: "GP Data for Planning and Research (GPDPR)",
    content: `...`,
  },
  {
    year: "2020",
    image_src: "/media/microchip-placeholder.png",
    alt_text: "Another description",
    header: "Caldicott Principles 7 & 8",
    content: `Principle 7: the duty to share information for individual care is as important as the duty to protect patient confidentiality.
Principle 8: inform patients and services users about how their confidential information is used and what choice they have. There should be no surprises.)`,
  },
  {
    year: "2022-23",
    image_src: "/media/microchip-placeholder.png",
    alt_text: "Another description",
    header: "England's NHS bodies become a single organisation",
    content: `The mergence of NHS Health Education England, NHS Improvement, NHS X and the NHS Digital into NHS England.`,
  },
  {
    year: "2023",
    image_src: "/media/microchip-placeholder.png",
    alt_text: "Another description",
    header: "Federated Data Platform",
    content: `Controlled by the NHS “to unlock the power of NHS data to understand patterns, solve problems, plan services for local populations and ultimately transform the health and care of the people they serve.” 
Mixture of use cases such as:
Direct care
Public health
Healthcare planning and research
This mixed use case has complications in English law.`,
  },
  {
    year: "2024",
    image_src: "/media/fci-logo.png",
    alt_text: "Another description",
    header:
      "Faculty of Clinical Informatics absorbed into British Computer Society",
    content: `The Faculty of Clinical Informatics (FCI) has been absorbed into the British Computer Society (BCS). The FCI will continue to operate as a special interest group within the BCS.`,
  },
];

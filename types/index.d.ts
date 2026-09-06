type INavigation = {
  name: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
};

type ITech = {
  imageUri: string;
  name: string;
  category?:
    | "frontend"
    | "state"
    | "backend"
    | "database"
    | "devops"
    | "tools";
  description?: string;
};

type IProject = {
  name: string;
  role: string;
  summary: string;
  responsibilities: string[];
  technicalHighlights: string[];
  previewImages: string[];
  url?: string;
  logo?: string;
};

type IExperience = {
  companyName: string;
  comanyLogo: string;
  positionWork: string;
  startTime: string;
  endTime: string;
  summary: string;
};

type IStat = {
  label: string;
  value: number;
  suffix?: string;
};

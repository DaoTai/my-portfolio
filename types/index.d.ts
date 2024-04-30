type INavigation = {
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
};

type ITech = {
  imageUri: string;
  name: string;
};

type IProject = {
  name: string;
  summary: string;
  startTime: string;
  endTime: string;
  uri: string;
  teckStack: string[];
  previewImages: string[];
  features: string[];
  githubUri?: string[];
  videoDemo?: string;
};

type IExperience = {
  companyName: string;
  comanyLogo: string;
  positionWork: string;
  startTime: string;
  endTime: string;
  summary: string;
  tags: string[];
};

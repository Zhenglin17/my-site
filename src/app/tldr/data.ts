export type ExperienceItem = {
  slug: string;
  title: string;
  subtitle: string;
  category: "Research" | "Course Project" | "Work";
  tags: string[];
  location: string;
  period: string;
  summary: string;
  bullets: string[];
  links: { label: string; href: string }[];
  images?: { src: string; alt: string; caption?: string }[];
};

export const items: ExperienceItem[] = [
  {
    slug: "normal-flow",
    title: "Normal Flow and Camera Ego-Motion Estimation",
    subtitle: "Computer Vision · Sensor Fusion · 3D Vision · Optical Flow",
    category: "Research",
    tags: ["Computer Vision", "Sensor Fusion", "3D Vision", "Optical Flow", "PyTorch"],
    location: "College Park, MD",
    period: "Dec 2023 – May 2024",
    summary:
      "End-to-end event camera normal flow pipeline with IMU fusion — cut rotation drift 50% and enabled stable downstream perception.",
    bullets: [
      "Built an end-to-end event camera normal flow estimation pipeline on EVIMO using PyTorch, with reproducible benchmarks and both classical and learning-based baselines, which improved experimental efficiency and enabled more reliable model comparisons.",
      "Integrated IMU measurements with vision derived flow to estimate camera ego motion in a consistent world frame, which reduced rotation drift by 50% through frame alignment checks and enabled downstream perception tasks to run with higher pose stability.",
      "Organized training and evaluation into modular, configurable scripts with standardized datasets and metrics, which improved reproducibility and streamlined collaboration across experiments.",
    ],
    links: [
      { label: "EVIMO Dataset", href: "https://better-flow.github.io/evimo/" },
      { label: "Code (normal_flow)", href: "https://github.com/Zhenglin17/normal_flow" },
      { label: "Code (e_raft_evimo)", href: "https://github.com/Zhenglin17/e_raft_evimo" },
    ],
    images: [
      {
        src: "https://better-flow.github.io/evimo/img/dataset.png",
        alt: "EVIMO dataset preview",
        caption:
          "EVIMO — indoor event camera dataset with 200 Hz pose tracking, pixelwise object masks at 40 Hz, and depth maps.",
      },
    ],
  },
  {
    slug: "feature-matching",
    title: "Feature Matching for Event Camera",
    subtitle: "3D Vision · Deep Learning",
    category: "Research",
    tags: ["3D Vision", "Deep Learning", "COLMAP", "Event Camera"],
    location: "Philadelphia, PA",
    period: "May 2022 – Feb 2023",
    summary:
      "Trained keypoint matching network on event camera data using COLMAP-based ground truth — improved accuracy under motion blur and low-light.",
    bullets: [
      "Aligned DSEC event streams with traditional frame imagery and triangulated 3D points reconstruction based on COLMAP, which created reliable ground truth correspondences for supervision and largely increased usable training pairs to accelerate model development for event-based feature matching.",
      "Trained key point matching network using cross-entropy interest point loss and hinge descriptor loss, improving matching accuracy under motion blur and low-light conditions through patch-based versus global ablations and more effective hard negative mining.",
    ],
    links: [
      { label: "DSEC Dataset", href: "https://dsec.ifi.uzh.ch/" },
      { label: "Code", href: "https://github.com/Zhenglin17/Feature-point-matching" },
    ],
    images: [
      {
        src: "https://dsec.ifi.uzh.ch/wp-content/uploads/2021/05/thumbnail.png",
        alt: "DSEC dataset overview",
        caption: "DSEC — large-scale stereo event camera dataset for driving scenarios.",
      },
      {
        src: "https://dsec.ifi.uzh.ch/wp-content/uploads/2021/10/flow-thumbnail.png",
        alt: "DSEC optical flow ground truth",
        caption: "DSEC optical flow ground truth used for training and evaluation.",
      },
    ],
  },
  {
    slug: "fruit-counting",
    title: "Robust Fruit Counting",
    subtitle: "Robotics Perception · System Engineering",
    category: "Research",
    tags: ["YOLO", "Kalman Filter", "Robotics Perception", "Multi-view Geometry"],
    location: "Philadelphia, PA",
    period: "Nov 2021 – Mar 2022",
    summary:
      "Multi-stage fruit counting system combining YOLO, Kalman filtering, and pose priors — reduced multi-counting by 60%.",
    bullets: [
      "Prototyped a multistage fruit counting system across long image sequences combining Yolo detection, association, and motion modeling, which reduced double or multi counting by 60% via Kalman filtering and multi view geometry pose priors while keeping runtime within deployment constraints.",
      "Conducted error analysis, data validation, and runtime profiling on long sequences to identify edge cases and improve the stability of the end-to-end pipeline.",
    ],
    links: [
      { label: "Code", href: "https://github.com/Zhenglin17/Counting-and-Tracking" },
    ],
  },
  {
    slug: "solo",
    title: "SOLO on Biomedical Hemostatic Plug Image",
    subtitle: "Instance Segmentation · Deep Learning · Model Architecture",
    category: "Course Project",
    tags: ["Instance Segmentation", "Deep Learning", "ResNet-50", "GRU", "DBSCAN"],
    location: "Philadelphia, PA",
    period: "Sep 2021 – Dec 2021",
    summary:
      "Adapted SOLO with a custom ResNet-50 + GRU backbone for biomedical image segmentation — boosted F1 by 12%.",
    bullets: [
      "Standardized a biomedical Hemostatic Plug Slice dataset with DBSCAN-based preprocessing and robust augmentation pipelines, improving label consistency and increasing binary instance segmentation F1 by 12% compared to benchmark through stable data loaders and reproducible experiment splits.",
      "Adapted SOLO with a customized ResNet-50 backbone and added GRU modules across FPN levels for domain adaptation, leading to noticeable improvements in instance segmentation accuracy after hyperparameter tuning and ablation analysis.",
    ],
    links: [
      { label: "Code", href: "https://github.com/Zhenglin17/Solo-and-RNN-Solo" },
    ],
  },
  {
    slug: "block-grabbing",
    title: "Block Grabbing · Robotic Arm Motion",
    subtitle: "Motion Planning · Control",
    category: "Course Project",
    tags: ["Motion Planning", "A* Search", "Rigid Body Transforms", "Control"],
    location: "Philadelphia, PA",
    period: "Dec 2020",
    summary:
      "Robotic arm planning with A* and collision-aware trajectories — 3rd place out of 30 teams in a live 2v2 competition.",
    bullets: [
      "Implemented robotic arm planning using rigid body transforms, A* search, and task heuristics for dynamic targets, maximized pick success rate in a 2v2 competition by optimizing approach poses, collision aware trajectories, and time efficient execution planning.",
      "Engineered grasping and stacking behaviors in both static and dynamic environments with orientation constraints and recovery logic, achieving 3rd place out of 30 teams by improving end-effector alignment and execution consistency under strict timing.",
    ],
    links: [],
  },
  {
    slug: "microsoft",
    title: "Microsoft · Part-time Assistant",
    subtitle: "Data Engineering · Distributed Systems",
    category: "Work",
    tags: ["Data Engineering", "HDFS", "Distributed Systems", "Web Crawling"],
    location: "Beijing, China",
    period: "Jun 2019 – Sep 2019",
    summary:
      "Built scalable web crawling and HDFS ingestion pipelines on a server cluster — improved data freshness from weekly to daily.",
    bullets: [
      "Deployed a scalable web crawling workflow to a server cluster and built HDFS ingestion with feature table generation for page text and title extraction, which enabled downstream analytics pipelines and improved data freshness from weekly batches to daily updates.",
      "Implemented basic resource management and scheduling rules to balance workloads across cluster nodes and improve system reliability.",
    ],
    links: [],
  },
];

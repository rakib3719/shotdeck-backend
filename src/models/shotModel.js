import mongoose from "mongoose";

const shotSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    youtubeLink: { type: String },

    gallery: [{ type: String }],

    mediaType: {
      type: String,
      enum: ["Movie", "TV", "Trailer", "Music Video", "Commercial"],
    },
    genre: [{ type: String, enum: ["Movie/TV", "Music Video", "Commercial"] }],
    releaseYear: { type: Number },

    timePeriod: {
      type: String,
      enum: [
        "Future",
        "2020s",
        "2010s",
        "2000s",
        "1900s",
        "1800s",
        "1700s",
        "Renaissance: 1400–1700",
        "Medieval: 500–1499",
        "Ancient: 2000BC–500AD",
        "Stone Age: pre–2000BC",
      ],
    },

    colorType: [
      {
        type: String,
        enum: [
          "Warm",
          "Cool",
          "Mixed",
          "Saturated",
          "Desaturated",
          "Red",
          "Orange",
          "Yellow",
          "Green",
          "Cyan",
          "Blue",
          "Purple",
          "Magenta",
          "Pink",
          "White",
          "Sepia",
          "Black & White",
        ],
      },
    ],

    roscoColor: { type: String }, // predefined string if needed
    customColor: { type: String }, // HEX

    aspectRatio: {
      type: String,
      enum: [
        "9:16",
        "1:1",
        "1.20",
        "1.33",
        "1.37",
        "1.43",
        "1.66",
        "1.78",
        "1.85",
        "1.90",
        "2.00",
        "2.20",
        "2.35",
        "2.39",
        "2.55",
        "2.67",
        "2.76",
      ],
    },

    opticalFormat: {
      type: String,
      enum: [
        "Anamorphic",
        "Spherical",
        "Super 35",
        "3 perf",
        "2 perf",
        "Open Gate",
        "3D",
      ],
    },

    labProcess: [
      {
        type: String,
        enum: ["Bleach Bypass", "Cross Process", "Flashing"],
      },
    ],

    format: {
      type: String,
      enum: [
        "Film - 35mm",
        "Film - 16mm",
        "Film - Super 8mm",
        "Film - 65mm",
        "Film - 70mm",
        "Film - IMAX",
        "Digital",
        "Animation",
      ],
    },

    locationType: { type: String, enum: ["Interior", "Exterior"] },
    timeOfDay: {
      type: String,
      enum: ["Day", "Night", "Dusk", "Dawn", "Sunrise", "Sunset"],
    },

    numberOfPeople: {
      type: String,
      enum: ["None", "1", "2", "3", "4", "5", "6+"],
    },

    gender: [
      {
        type: String,
        enum: ["Male", "Female", "Trans"],
      },
    ],

    ageGroup: [
      {
        type: String,
        enum: [
          "Baby",
          "Toddler",
          "Child",
          "Teenager",
          "Young Adult",
          "Middle Age",
          "Senior",
        ],
      },
    ],

    ethnicity: [
      {
        type: String,
        enum: [
          "Black",
          "White",
          "Latinx",
          "Middle Eastern",
          "South-East Asian",
          "East Asian",
          "Indigenous Peoples",
          "Mixed-race",
        ],
      },
    ],

    frameSize: {
      type: String,
      enum: [
        "Extreme Wide",
        "Wide",
        "Medium Wide",
        "Medium",
        "Medium Close-Up",
        "Close-Up",
        "Extreme Close-Up",
      ],
    },

    shotType: [
      {
        type: String,
        enum: [
          "Aerial",
          "Overhead",
          "High Angle",
          "Low Angle",
          "Dutch Angle",
          "Establishing Shot",
          "Over the Shoulder",
          "Clean Single",
          "2 Shot",
          "3 Shot",
          "Group Shot",
          "Insert",
        ],
      },
    ],

    composition: {
      type: String,
      enum: [
        "Center",
        "Left Heavy",
        "Right Heavy",
        "Balanced",
        "Symmetrical",
        "Short Side",
      ],
    },

    lensType: {
      type: String,
      enum: [
        "Ultra Wide / Fisheye",
        "Wide",
        "Medium",
        "Long Lens",
        "Telephoto",
      ],
    },

    lightingStyle: [
      {
        type: String,
        enum: [
          "Soft Light",
          "Hard Light",
          "High Contrast",
          "Low Contrast",
          "Silhouette",
          "Top Light",
          "Underlight",
          "Side Light",
          "Backlight",
          "Edge Light",
        ],
      },
    ],

    lightingType: [
      {
        type: String,
        enum: [
          "Daylight",
          "Sunny",
          "Overcast",
          "Moonlight",
          "Artificial Light",
          "Practical Light",
          "Fluorescent",
          "Firelight",
          "Mixed Light",
        ],
      },
    ],

    director: { type: String },
    cinematographer: { type: String },
    productionDesigner: { type: String },
    costumeDesigner: { type: String },
    editor: [{ type: String }],

    camera: { type: String },
    lens: [{ type: String }],

    shotTime: { type: String },
    set: { type: String },
    storyLocation: { type: String },
    filmingLocation: { type: String },

    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    keywords: [{ type: String }],
  },
  { timestamps: true }
);

const Shot = mongoose.models.Shot || mongoose.model("Shot", shotSchema);
export default Shot;

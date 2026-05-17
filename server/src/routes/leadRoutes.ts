import express from "express";
import Lead from "../models/Lead";

const router = express.Router();



// CREATE LEAD
router.post("/", async (req, res) => {
  try {
    const lead = await Lead.create(req.body);

    res.status(201).json({
      message: "Lead created",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});



// GET ALL LEADS
router.get("/", async (req, res) => {
  try {
    const {
      search,
      status,
      source,
      sort = "latest",
      page = 1,
    } = req.query;

    const query: any = {};



    // SEARCH
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },

        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }



    // FILTER STATUS
    if (status) {
      query.status = status;
    }



    // FILTER SOURCE
    if (source) {
      query.source = source;
    }



    // PAGINATION
    const limit = 10;

    const skip = (Number(page) - 1) * limit;



    // SORTING
    const sortOption: any =
      sort === "oldest"
        ? { createdAt: 1 }
        : { createdAt: -1 };



    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);



    const total = await Lead.countDocuments(query);

    res.status(200).json({
      leads,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});



// GET SINGLE LEAD
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});



// UPDATE LEAD
router.put("/:id", async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Lead updated",
      updatedLead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});



// DELETE LEAD
router.delete("/:id", async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Lead deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});



export default router;
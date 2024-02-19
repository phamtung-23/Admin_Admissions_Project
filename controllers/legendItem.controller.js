import {
  mongooseToObject
} from "../utils/mongooses.js";

import LegendItem from "../models/LegendItem.js";

export const getLegendItemVi = async (req, res, next) => {
  try {
    const legendItems = await LegendItem.find().populate("legendGroup");
    const localizedLegendItems = legendItems.map(legendItem => {
      const {
        _id,
        createdAt,
        updatedAt,
        name,
        colorCode,
        colorImage,
        legendGroup,
        __v
      } = legendItem.toObject();

      return {
        id: _id,
        name: name.vi,
        colorCode,
        colorImage,
        legendGroup: {
          id: legendGroup._id,
          name: legendGroup.name.vi
        }
      };
    });

    res.status(200).json(localizedLegendItems);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
}
export const getLegendItemEn = async (req, res, next) => {
  try {
    const legendItems = await LegendItem.find().populate("legendGroup");
    const localizedLegendItems = legendItems.map(legendItem => {
      const {
        _id,
        createdAt,
        updatedAt,
        name,
        colorCode,
        colorImage,
        legendGroup,
        __v
      } = legendItem.toObject();

      return {
        id: _id,
        name: name.en,
        colorCode,
        colorImage,
        legendGroup: {
          id: legendGroup._id,
          name: legendGroup.name.en
        }
      };
    });

    res.status(200).json(localizedLegendItems);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
}
export const getDetailLegendItemVi = async (req, res, next) => {
  try {
    const legendItem = await LegendItem.findById(req.params.id).populate("legendGroup");
    const {
      _id,
      createdAt,
      updatedAt,
      name,
      colorCode,
      colorImage,
      legendGroup,
      __v
    } = legendItem.toObject();

    res.status(200).json({
      id: _id,
      name: name.vi,
      colorCode,
      colorImage,
      legendGroup: {
        id: legendGroup._id,
        name: legendGroup.name.vi
      }
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
}

export const getDetailLegendItemEn = async (req, res, next) => {
  try {
    const legendItem = await LegendItem.findById(req.params.id).populate("legendGroup");
    const {
      _id,
      createdAt,
      updatedAt,
      name,
      colorCode,
      colorImage,
      legendGroup,
      __v
    } = legendItem.toObject();

    res.status(200).json({
      id: _id,
      name: name.en,
      colorCode,
      colorImage,
      legendGroup: {
        id: legendGroup._id,
        name: legendGroup.name.en
      }
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
}


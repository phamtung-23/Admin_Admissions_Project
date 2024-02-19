import {
  mongooseToObject
} from "../utils/mongooses.js";

import LegendGroup from '../models/LegendGroup.js';

export const getLegendGroupVi = async (req, res) => {
  try {
    const legendGroups = await LegendGroup.find();
    const localizedLegendGroups = legendGroups.map(legendGroup => {
      const { _id, createdAt, updatedAt, name } = legendGroup.toObject();

      return {
          id: _id,
          name: name.vi
      };
    });

    res.status(200).json(localizedLegendGroups);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

export const getLegendGroupEn = async (req, res) => {
  try {
    const legendGroups = await LegendGroup.find();
    const localizedLegendGroups = legendGroups.map(legendGroup => {
      const { _id, createdAt, updatedAt, name } = legendGroup.toObject();

      return {
          id: _id,
          name: name.en
      };
    });

    res.status(200).json(localizedLegendGroups);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
export const getDetailLegendGroupVi = async (req, res) => {
  try {
    const legendGroup = await LegendGroup.findById(req.params.id);

    const localizedLegend = {
      id: legendGroup._id,
      name: legendGroup.name.vi,
    };

    res.status(200).json(localizedLegend);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
export const getDetailLegendGroupEn = async (req, res) => {
  try {
    const legendGroup = await LegendGroup.findById(req.params.id);

    const localizedLegend = {
      id: legendGroup._id,
      name: legendGroup.name.en,
    };

    res.status(200).json(localizedLegend);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Folder = require('../models/Folder');
const File = require('../models/File');
const checkAuth = require('../middleware/auth');
const User = require('../models/User');
const { FolderSchema } = require('../validations/FolderValidation');
const { validateInput } = require('../utils/common-functions');

const uploadMedia2 = require('../../services/firebase');

const Multer = multer({
  storage: multer.memoryStorage(),
  limits: 1024 * 1024,
});
const router = express.Router();

router.post('/', checkAuth, async (req, res) => {
  try {
    const checkValidation = validateInput(FolderSchema, req.body);
    if (!checkValidation.value) {
      return res.status(403).json('Please check your Folder Name');
    }

    const AuthUserData = await User.findById(req.user.userId); // Get logged user data
    const { role } = AuthUserData;
    const owner = mongoose.Types.ObjectId(req.user.userId);

    const { name, parentId } = req.body;
    if (role === 'franchisor' || role === 'franchisee') {
      if (parentId) {
        const folder = new Folder({
          name,
          parentId,
          share: true,
          owner,
        });
        await folder.save();
        return res.sendStatus(200);
      } else {
        const folder = new Folder({
          name,
          owner,
        });
        await folder.save();
        return res.sendStatus(200);
      }
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.post(
  '/upload',
  Multer.array('image', 5),
  uploadMedia2,
  checkAuth,
  async (req, res) => {
    try {
      const AuthUserData = await User.findById(req.user.userId);
      const { role } = AuthUserData;

      if (role === 'franchisor' || role === 'franchisee') {
        for (const media of req.media) {
          const file = new File({
            name: media.name,
            Filetype: media.mimetype,
            url: media.url,
            size: media.size,
            owner: req.user.userId,
          });
          await file.save();
        }

        return res.sendStatus(200);
      } else {
        return res.sendStatus(401);
      }
    } catch (error) {
      return res.sendStatus(500);
    }
  }
);

router.post(
  '/upload/:id',
  Multer.array('image', 5),
  uploadMedia2,
  checkAuth,
  async (req, res) => {
    try {
      const AuthUserData = await User.findById(req.user.userId);
      const { role } = AuthUserData;
      if (role === 'franchisor' || role === 'franchisee') {
        for (const media of req.media) {
          const file = new File({
            name: media.name.split('.')[0],
            Filetype: media.mimetype,
            url: media.url,
            size: media.size,
            folder: req.params.id,
            share: true,
            owner: req.user.userId,
          });
          await file.save();
        }
        return res.sendStatus(200);
      } else {
        return res.sendStatus(401);
      }
    } catch (error) {
      return res.sendStatus(500);
    }
  }
);

router.post('/all', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId); // Get logged user data
    const { role, id } = AuthUserData;

    if (role === 'franchisor' || req.body?.user === 'admin') {
      if (req.body?.user?.length === 24) {
        const data = await Folder.find({
          status: true,
          share: true,
          owner: req.body?.user,
        })
          .sort({ name: 1 })
          .populate('owner', 'firstName lastName role');
        const Fdata = data.filter(
          (value) => value.owner?.role === 'franchisee'
        );

        const filtered = Fdata.filter((files) => !files.parentId);

        const file = await File.find({
          status: true,
          share: true,
          owner: req.body?.user,
        })
          .sort({ name: 1 })
          .populate('owner', 'firstName lastName role');

        const filesData = file.filter((files) => !files.folder);

        filesData.forEach((filedata) => {
          filtered.push(filedata);
        });
        res.status(200).json(filtered);
      } else {
        const data = await Folder.find({ status: true })
          .sort({ name: 1 })
          .populate('owner', 'firstName lastName role');
        const Fdata = data.filter(
          (value) => value.owner?.role === 'franchisor'
        );
        const shareDdata = await User.find({ share: true });
        console.log('test', shareDdata.length);
        if (role === 'franchisor' && shareDdata.length > 0) {
          Fdata.unshift({ different: true, name: 'Franchisee Shared' });
        }
        const filtered = Fdata.filter((files) => !files.parentId);

        const file = await File.find({ status: true })
          .sort({ name: 1 })
          .populate('owner', 'firstName lastName role');

        const filesData = file.filter((files) => !files.folder);

        filesData.forEach((filedata) => {
          filtered.push(filedata);
        });
        res.status(200).json(filtered);
      }
    }
    if (role === 'franchisee' && req.body?.user === 'user') {
      const data = await Folder.find({ status: true, owner: id })
        .sort({ name: 1 })
        .populate('owner', 'firstName lastName role');

      const Fdata = data.filter((value) => value.owner?.role === 'franchisee');

      const filtered = Fdata.filter((files) => !files.parentId);

      const file = await File.find({ status: true, owner: id })
        .sort({ name: 1 })
        .populate('owner', 'firstName lastName role');

      const filesData = file.filter((files) => !files.folder);

      filesData.forEach((filedata) => {
        filtered.push(filedata);
      });
      res.status(200).json(filtered);
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/:id', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId); // Get logged user data
    const { role } = AuthUserData;

    if (role === 'franchisor' || role === 'franchisee') {
      const data = await Folder.findOne({ _id: req.params.id });

      return res.status(200).json(data);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.post('/franchisee', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId); // Get logged user data
    const { role } = AuthUserData;

    if (role === 'franchisor') {
      const data = await User.find({ share: true });

      return res.status(200).json(data);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.post('/sub/:id', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId); // Get logged user data
    const { role } = AuthUserData;

    if (role === 'franchisor' || role === 'franchisee') {
      if (req.body?.user?.length === 24) {
        const data = await Folder.find({
          parentId: req.params.id,
          status: true,
          share: true,
        })
          .sort({ name: 1 })
          .populate('owner', 'firstName lastName');

        const file = await File.find({
          folder: req.params.id,
          status: true,
          share: true,
        })
          .sort({ name: 1 })
          .populate('owner', 'firstName lastName');

        file.forEach((files) => {
          data.push(files);
        });
        return res.status(200).json(data);
      } else {
        const data = await Folder.find({
          parentId: req.params.id,
          status: true,
        })
          .sort({ name: 1 })
          .populate('owner', 'firstName lastName');

        const file = await File.find({
          folder: req.params.id,
          status: true,
        })
          .sort({ name: 1 })
          .populate('owner', 'firstName lastName');

        file.forEach((files) => {
          data.push(files);
        });
        return res.status(200).json(data);
      }
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/status', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId); // Get logged user data
    const { role } = AuthUserData;

    if (role === 'franchisor' || role === 'franchisee') {
      const filter = { _id: req.body.id };
      const update = { status: req.body.status };
      await Folder.findOneAndUpdate(filter, update);
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/folderName', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId); // Get logged user data
    const { role } = AuthUserData;

    if (role === 'franchisor' || role === 'franchisee') {
      const filter = { _id: req.body.id };
      const update = { name: req.body.name };
      await Folder.findOneAndUpdate(filter, update);
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/file', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId); // Get logged user data
    const { role } = AuthUserData;

    if (role === 'franchisor' || role === 'franchisee') {
      const filter = { _id: req.body.id };
      const update = { status: req.body.status };
      await File.findOneAndUpdate(filter, update);
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/fileshare', checkAuth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.user.userId }, { share: true }); // Get logged user data
    const AuthUserData = await User.findById(req.user.userId);
    const { role } = AuthUserData;
    if (role === 'franchisee') {
      const filter = { _id: req.body.id };
      const update = { share: req.body.share };
      await File.findOneAndUpdate(filter, update);
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/foldershare', checkAuth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.user.userId }, { share: true }); // Get logged user data
    const AuthUserData = await User.findById(req.user.userId);
    const { role } = AuthUserData;

    if (role === 'franchisee') {
      const filter = { _id: req.body.id };
      const update = { share: req.body.share };
      await Folder.findOneAndUpdate(filter, update);
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});
router.put('/fileName', checkAuth, async (req, res) => {
  try {
    const AuthUserData = await User.findById(req.user.userId); // Get logged user data
    const { role } = AuthUserData;

    if (role === 'franchisor' || role === 'franchisee') {
      const filter = { _id: req.body.id };
      const update = { name: req.body.name };
      await File.findOneAndUpdate(filter, update);
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});
router.put('/:id', checkAuth, async (req, res) => {
  try {
    const checkValidation = validateInput(FolderSchema, req.body);
    if (!checkValidation.value) {
      return res.status(403).json('Please check your Folder Name');
    }
    const AuthUserData = await User.findById(req.user.userId); // Get logged user data
    const { role } = AuthUserData;

    if (role === 'franchisor' || role === 'franchisee') {
      const { name } = req.body;

      const filter = { _id: req.params.id };
      const update = {
        name,
      };

      await Folder.findOneAndUpdate(filter, update);
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;

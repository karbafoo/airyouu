const Package = require('./package.model');
const Point = require('./point.model');
const {NewStatus} = require('../status/status.controller');
const {parseUsers} = require('../user/user.controller');
const ERRORS = require('../../util/ERRORS.json');
const makeNewDelivery = ({user, items, points} = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pointDocs = await Promise.all(
                (points || []).map((point) => __makePoint__(point))
            );

            const newPackage = new Package({
                user: user,
                items: items,
                points: pointDocs,
            });
            const statusDoc = await NewStatus(newPackage, 'Package', 'pending');

            newPackage.set({status: statusDoc._id});
            newPackage.save((err, packageDoc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(parsePackages([packageDoc])[0]);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
};
const updatePackage = ({package_id, user, items, points, status} = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            Package.findById(package_id)
                .then(async (package) => {
                    if (package) {
                        const pointDocs = points
                            ? await Promise.all(
                                  (points || []).map((point) =>
                                      __makePoint__(point)
                                  )
                              )
                            : null;
                        const statusDoc = status
                            ? await NewStatus(package, 'Package', status)
                            : null;
                        package.set({
                            ...(user ? {user: user} : {}),
                            ...(pointDocs ? {points: pointDocs} : {}),
                            ...(items ? {items: items} : {}),
                            ...(statusDoc ? {status: statusDoc} : {}),
                        });
                        package.save(async (err, packageDoc) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(
                                    await getPackage({
                                        package_id: packageDoc._id,
                                    })
                                );
                            }
                        });
                    } else {
                        reject(ERRORS.PACKAGE_NOT_FOUND);
                    }
                })
                .catch(reject);
        } catch (err) {
            reject(err);
        }
    });
};
const updatePackagePoint = ({point_id, name, position, status} = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            Point.findById(point_id)
                .then(async (point) => {
                    if (point) {
                        const statusDoc = status
                            ? await NewStatus(point, 'Point', status)
                            : null;
                        point.set({
                            ...(name ? {name: name} : {}),
                            ...(position ? {position: position} : {}),
                            ...(statusDoc ? {status: statusDoc} : {}),
                        });
                        point.save((err, pointDoc) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(parsePoints([pointDoc])[0]);
                            }
                        });
                    } else {
                        reject(ERRORS.POINT_NOT_FOUND);
                    }
                })
                .catch(reject);
        } catch (err) {
            reject(err);
        }
    });
};
const getAllPackages = ({skip, limit} = {}) => {
    return new Promise((resolve, reject) => {
        Package.find({})
            .skip(skip)
            .limit(limit)
            .populate([
                {path: 'points', populate: 'status'},
                {path: 'user'},
                {path: 'status'},
            ])
            .lean()
            .then((packageDocs) => {
                resolve(parsePackages(packageDocs));
            })
            .catch(reject);
    });
};
const getAllPackagesForUser = ({user, skip, limit} = {}) => {
    return new Promise((resolve, reject) => {
        if (!user) {
            return resolve([]);
        }
        Package.find({user: user})
            .skip(skip)
            .limit(limit)
            .populate([
                {path: 'points', populate: 'status'},
                {path: 'user'},
                {path: 'status'},
            ])
            .lean()
            .then((packageDocs) => {
                resolve(parsePackages(packageDocs));
            })
            .catch(reject);
    });
};
const getPackage = ({package_id} = {}) => {
    return new Promise((resolve, reject) => {
        Package.findById(package_id)
            .populate([
                {path: 'points', populate: {path: 'status', select: 'status'}},
                {path: 'user'},
                {path: 'status'},
            ])
            .lean()
            .then((packageDoc) => {
                resolve(parsePackages([packageDoc])[0]);
            })
            .catch(reject);
    });
};
module.exports = {
    makeNewDelivery,
    updatePackage,
    updatePackagePoint,
    getAllPackages,
    getAllPackagesForUser,
    getPackage,
};

const __makePoint__ = ({name, position, status} = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newPoint = new Point({
                name: name,
                position: position,
            });

            const statusDoc = await NewStatus(
                newPoint,
                'Point',
                status || 'pending'
            );

            newPoint.set({status: statusDoc._id});
            newPoint.save((err, pointDoc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(pointDoc.toObject());
                }
            });
        } catch (err) {
            reject(err);
        }
    });
};

const parsePoints = (points = []) => {
    if (points && points.length) {
        return points.map((p) => ({
            point_id: p._id,
            name: p.name,
            position: p.position,
            status: p.status ? p.status.status : '',
        }));
    }
    return [];
};
const parsePackages = (packages = []) => {
    if (packages && packages.length) {
        return packages.map((u) => ({
            package_id: u._id,
            user: u.user ? parseUsers([u.user])[0] : null,
            items: u.items,
            points: parsePoints(u.points),
            status: u.status ? u.status.status : '',
        }));
    }
    return [];
};

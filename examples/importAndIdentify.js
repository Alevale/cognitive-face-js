// NOTE: We are going to be using the same person group across the whole demo, otherwise you can also list and get the
// one you are interested in.
// We are also going to create everything from the scratch and we are going to see how good the recognisement is
// 20190515:Alevale

// NOTE: We are going to make the setup of the faces and people here, just as an example 20190516:Alevale
const people = [
    {
        name: 'Person1',
        userData: {
            email: 'person@example.com',
            username: 'something',
            some: 'more random data'
        },
        pictures: [
            'http://example.com/pictur1.jpg'
        ],
        testPicture: 'http://example.com/test1picture.jpg'
    },
    {
        name: 'Person2',
        userData: {
            email: 'Person2@example.com',
            username: 'something',
            some: 'more random data'
        },
        pictures: [
            'http://example.com/picture2.jpg'
        ],
        testPicture: 'http://example.com/test2picture.jpg'
    },
    {
        name: 'Person3',
        userData: {
            email: 'Person3@example.com',
            username: 'something',
            some: 'more random data'
        },
        pictures: [
            'http://example.com/picture3.jpg'
        ],
        testPicture: 'http://example.com/test3picture.jpg'
    }
]

const waitFor = (time) => {
    return new Promise((resolve, reject) => {
        return setTimeout(resolve, time)
    })
}

const importPeopleAndIdentifyThem = async (people) => {

    const {
        subscriptionKey,
        personGroupId
    } = {
        subscriptionKey: 'XXXXXXXXXXXXXXXXXXX',
        personGroupId: 'some_group_in_which_to_put_this_people'
    }

    try {

        const faceApi = new FaceApiTranslator({
            subscriptionKey,
            personGroupId
        })

        // NOTE: Creates a new group 20190515:Alevale
        await faceApi.createPersonGroup({
            name: 'some_name_for_the_group',
            userData: 'Some_data_for_the_group'
        })

        // NOTE: Iterate through the passed people 20190515:Alevale
        for (person of people) {

            // NOTE: Create a new person 20190515:Alevale
            const { data: { personId } } = await faceApi.createNewPerson({
                name: person.name,
                userData: person.userData
            })


            for (picture of person.pictures) {
                await waitFor(1000)
                console.log('adding image of', person.name)
                // NOTE: Add some pictures to that person 20190515:Alevale
                faceApi.addImageToPerson({
                    personId,
                    faceUrl: picture
                })
            }

        }

        // NOTE: After adding some pictures train the models 20190515:Alevale
        faceApi.trainPersonGroup({})

        // NOTE: Wait till the model is trained 20190515:Alevale
        let finishedTraining = false
        while (!finishedTraining) {
            await waitFor(1000)
            const { data: status } = await faceApi.getTrainingStatus({})
            console.log('still training, status', status)
            finishedTraining = status.status === 'succeeded'
        }

        // NOTE: Iterate through the passed people 20190515:Alevale
        for (person of people) {

            // NOTE: Detect a face 20190515:Alevale
            const { data: [{ faceId }] } = await faceApi.detectAFace({
                faceUrl: person.testPicture
            })

            // NOTE: Identify a face 20190515:Alevale
            const { data: [{ candidates }] } = await faceApi.identifyAPicture(undefined, {
                    faceIds: faceId
                }
            )

            for (candidate of candidates) {
                const { data } = await faceApi.getPersonDetails({
                    personId: candidate.personId
                })
                console.log()
                console.log()
                console.log('recognised', data)
                console.log('Person passed was', person.name)
                console.log()
                console.log()
            }
        }


    } catch (e) {
        console.log(e)
    }
}

importPeopleAndIdentifyThem(people)

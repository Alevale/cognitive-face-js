const recogniseFromFaceId = async ({ faceId }) => {
    const {
        subscriptionKey,
        personGroupId
    } = {
        subscriptionKey: 'XXXXXXXXXXXXXX',
        personGroupId: 'group_to_search_the_person_in'
    }

    const faceApi = new FaceApiTranslator({
        subscriptionKey,
        personGroupId
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
        console.log(data)
    }

}

// NOTE: FaceId generated from the detect endpoint, detectAFace method 20190516:Alevale
recogniseFromFaceId({faceId: '000000-0000-4000-9b76-000000000000'})

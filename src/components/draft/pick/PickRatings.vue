<script>

export default {
  name: 'PickRatings',

  props: {
    pick_ratings: {
      type: Array,
      required: true
    }
  },
}

</script>

<template>

<table class="table table-sm">
<thead>
<th>
  Name
</th>
</thead>
<tbody>
<tr v-for="pick_rating in pick_ratings" :key="pick_rating.card.id">
  <td>{{ pick_rating.card.name }}</td>
</tr>
</tbody>
</table>

</template>

<style>

</style>


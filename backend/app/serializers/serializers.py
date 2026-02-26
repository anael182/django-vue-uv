from rest_framework import serializers

from ..models.Todo import Todo


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'title', 'text', 'completed', 'created_at']
